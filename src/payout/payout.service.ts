import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { PaymentService } from '../payment/payment.service';
import { Store } from '../store/entities/store.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Config } from '../config/entities/config.entity';
import { PaymentStatus } from '../payment/payment-status.enum';
import { PaymentDetails, Payout, ProcessPayoutResponse } from './payout.types';

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
    const systemCommission = config.a + (config.b / 100) * payment.amount;
    const shopCommission = (store.platformCommission / 100) * payment.amount;
    const totalCommission = systemCommission + shopCommission;
    return payment.amount - totalCommission;
  }

  /**
   * Calculate available payout for a payment based on its status.
   * For PROCESSED: available = (net - hold) - paidAmount, where hold = (D% * amount)
   * For EXECUTED: available = net - paidAmount.
   */
  calculateAvailable(payment: Payment, net: number, config: Config): number {
    if (payment.status === PaymentStatus.PROCESSED) {
      const hold = (config.d / 100) * payment.amount;
      return net - hold - payment.paidAmount;
    } else if (payment.status === PaymentStatus.EXECUTED) {
      return net - payment.paidAmount;
    }
    return 0;
  }

  async processPayout(store: Store): Promise<ProcessPayoutResponse> {
    const config = await this.configService.getConfig();
    const payments: ProcessPayoutResponse = {
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

    for (const { netPayout, payment } of paymentDetails) {
      if (netPayout > 0 && totalAvailable - netPayout > 0) {
        totalAvailable -= netPayout;
        payments.totalPayout += netPayout;

        const newStatus =
          payment.status === PaymentStatus.EXECUTED
            ? PaymentStatus.PAID
            : PaymentStatus.PROCESSED;

        await this.paymentService.payout({
          paymentId: payment.id,
          status: newStatus,
          paidAmount: netPayout,
        });

        payments.listPayments.push({ id: payment.id, payout: netPayout });
      }
    }

    return payments;
  }
}
