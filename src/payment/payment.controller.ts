import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { PaymentDto } from './dto/process-payment.dto';

@ApiTags('Payment')
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
  async setProcessed(@Body() paymentDto: PaymentDto): Promise<{
    updatedPayments: number[];
  }> {
    const { updatedPayments } =
      await this.paymentService.setPaymentsProcessed(paymentDto);
    return { updatedPayments };
  }

  @Post('execute')
  async setExecuted(@Body() paymentDto: PaymentDto): Promise<{
    updatedPayments: number[];
  }> {
    const { updatedPayments } =
      await this.paymentService.setPaymentsExecuted(paymentDto);
    return { updatedPayments };
  }
}
