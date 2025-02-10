import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { PaymentStatus } from './payment-status.enum';
import { StoreService } from '../store/store.service';
import { Store } from '../store/entities/store.entity';
import { PaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly storeService: StoreService,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    const { storeId, amount } = createPaymentDto;

    const store = await this.storeService.findById(storeId);

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const payment = this.paymentRepository.create({
      amount,
      store,
    });
    const newPayment = await this.paymentRepository.save(payment);
    return { paymentId: newPayment.id };
  }

  async setPaymentsProcessed({ paymentIds }: PaymentDto) {
    const paymentsAccepted = await this.paymentRepository.find({
      where: { id: In(paymentIds), status: PaymentStatus.ACCEPTED },
    });

    if (paymentsAccepted.length === 0) {
      throw new NotFoundException(
        'No payments found with status ACCEPTED for provided IDs.',
      );
    }
    const updatedIds = paymentsAccepted.map((p) => p.id);

    await this.paymentRepository.update(
      { id: In(updatedIds) },
      { status: PaymentStatus.PROCESSED },
    );

    return { updatedPayments: updatedIds };
  }

  async setPaymentsExecuted({ paymentIds }: PaymentDto) {
    const paymentsProcessed = await this.paymentRepository.find({
      where: { id: In(paymentIds), status: PaymentStatus.PROCESSED },
    });

    if (paymentsProcessed.length === 0) {
      throw new NotFoundException(
        'No payments found with status PROCESSED for provided IDs.',
      );
    }

    const updatedIds = paymentsProcessed.map((p) => p.id);

    await this.paymentRepository.update(
      { id: In(updatedIds) },
      { status: PaymentStatus.EXECUTED },
    );

    return { updatedPayments: updatedIds };
  }

  /**
   * Get all payments that are eligible for payout for a given store.
   * @param store
   * @returns Payments that are eligible for payout
   */
  async getEligiblePayments(store: Store): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: [
        { store: store, status: PaymentStatus.PROCESSED },
        { store: store, status: PaymentStatus.EXECUTED },
      ],
      order: { status: 'DESC', createdAt: 'ASC' },
    });
  }

  async payout({
    paymentId,
    status,
    paidAmount,
  }: {
    paymentId: number;
    status: PaymentStatus;
    paidAmount: number;
  }): Promise<void> {
    await this.paymentRepository.update(
      { id: paymentId },
      { paidAmount, status },
    );
  }
}
