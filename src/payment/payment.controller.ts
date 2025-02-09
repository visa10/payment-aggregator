import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Post('process')
  async setProcessed(@Body() body: { paymentIds: number[] }) {
    await this.paymentService.setPaymentsProcessed(body.paymentIds);
    return { message: 'Payments set to PROCESSED' };
  }

  @Post('execute')
  async setExecuted(@Body() body: { paymentIds: number[] }) {
    await this.paymentService.setPaymentsExecuted(body.paymentIds);
    return { message: 'Payments set to EXECUTED' };
  }
}
