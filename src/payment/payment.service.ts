import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { PaymentStatus } from './payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(
    createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    const payment = this.paymentRepository.create(createPaymentDto);
    const newPayment = await this.paymentRepository.save(payment);
    return { paymentId: newPayment.id };
  }

  async setPaymentsProcessed(paymentIds: number[]) {
    await this.paymentRepository.update(
      { id: In(paymentIds) },
      { status: PaymentStatus.PROCESSED },
    );
  }

  async setPaymentsExecuted(paymentIds: number[]) {
    await this.paymentRepository.update(
      { id: In(paymentIds) },
      { status: PaymentStatus.EXECUTED },
    );
  }
}
