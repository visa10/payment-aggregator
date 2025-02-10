import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { PaymentService } from '../payment/payment.service';
import { Store } from '../store/entities/store.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Config } from '../config/entities/config.entity';
import { PaymentStatus } from '../payment/payment-status.enum';
import { PaymentDetails } from './payout.types';
import { ProcessPayoutResponseDto } from './dto/payout-response.dto';

@Injectable()
export class PayoutService {
  constructor(
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
  ) {}

  /**
   * Calculate the net payout for a payment.
   * net = amount - (A + (B% * amount) + (C% * amount))
   */
  calculateNetPayout(store: Store, payment: Payment, config: Config): number {
    const systemCommission =
      config.a + (config.b / 100) * Number(payment.amount);

    const shopCommission =
      (store.platformCommission / 100) * Number(payment.amount);

    const totalCommission = systemCommission + shopCommission;
    return Math.round((payment.amount - totalCommission) * 100) / 100;
  }

  /**
   * Calculate available payout for a payment based on its status.
   * For PROCESSED: available = (net - hold) - paidAmount, where hold = (D% * amount)
   * For EXECUTED: available = net - paidAmount.
   */
  calculateAvailable(payment: Payment, net: number, config: Config): number {
    if (payment.status === PaymentStatus.PROCESSED) {
      const hold = (config.d / 100) * Number(payment.amount);
      return Math.round((net - hold - Number(payment.paidAmount)) * 100) / 100;
    } else if (payment.status === PaymentStatus.EXECUTED) {
      return Math.round((net - Number(payment.paidAmount)) * 100) / 100;
    }
    return 0;
  }

  /**
   * Process payout for a store.
   * @param store
   * @returns ProcessPayoutResponseDto
   */
  async processPayout(store: Store): Promise<ProcessPayoutResponseDto> {
    const config = await this.configService.getConfig();
    const payments: ProcessPayoutResponseDto = {
      totalPayout: 0,
      listPayments: [],
    };

    const shopPayments: Payment[] =
      await this.paymentService.getEligiblePayments(store);

    let totalAvailable: number = 0;
    const paymentDetails: PaymentDetails[] = [];

    for (const payment of shopPayments) {
      const netPayout = this.calculateNetPayout(store, payment, config);
      const available = this.calculateAvailable(payment, netPayout, config);
      totalAvailable += available;
      paymentDetails.push({ payment, netPayout, available });
    }

    console.log('shopPayments', shopPayments);
    console.log('paymentDetails', paymentDetails);

    for (const { netPayout, payment, available } of paymentDetails) {
      if (
        (netPayout > 0 && totalAvailable - netPayout >= 0) ||
        (netPayout > 0 && available === 0)
      ) {
        const newStatus =
          payment.status === PaymentStatus.EXECUTED
            ? PaymentStatus.PAID
            : PaymentStatus.PROCESSED;

        await this.paymentService.payout({
          paymentId: payment.id,
          status: newStatus,
          paidAmount: netPayout,
        });

        if (available > 0) {
          totalAvailable -= netPayout;
          payments.totalPayout += netPayout;
          payments.listPayments.push({ id: payment.id, payout: netPayout });
        }
      }
    }

    return payments;
  }
}
