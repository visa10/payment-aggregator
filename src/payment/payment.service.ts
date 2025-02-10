import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { PaymentStatus } from './payment-status.enum';
import { Store } from '../store/entities/store.entity';
import { PaymentDto } from './dto/process-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async createPayment({
    store,
    amount,
  }: {
    store: Store;
    amount: number;
  }): Promise<CreatePaymentResponseDto> {
    const payment = this.paymentRepository.create({
      amount,
      store,
    });
    const newPayment = await this.paymentRepository.save(payment);
    return { paymentId: newPayment.id };
  }

  async setPaymentsProcessed({ paymentIds }: PaymentDto): Promise<void> {
    await this.paymentRepository.update(
      { id: In(paymentIds), status: PaymentStatus.ACCEPTED },
      { status: PaymentStatus.PROCESSED },
    );
  }

  async setPaymentsExecuted({ paymentIds }: PaymentDto): Promise<void> {
    await this.paymentRepository.update(
      { id: In(paymentIds), status: PaymentStatus.PROCESSED },
      { status: PaymentStatus.EXECUTED },
    );
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
