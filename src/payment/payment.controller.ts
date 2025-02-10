import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreatePaymentResponseDto } from './dto/create-payment-response.dto';
import { PaymentDto } from './dto/process-payment.dto';
import { StoreService } from '../store/store.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly storeService: StoreService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment created successfully.',
    type: CreatePaymentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Store not found',
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<CreatePaymentResponseDto> {
    const store = await this.storeService.findById(createPaymentDto.storeId);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return this.paymentService.createPayment({
      store,
      amount: createPaymentDto.amount,
    });
  }

  @Post('process')
  @ApiOperation({ summary: 'Set status process for payments.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments processed successfully.',
  })
  async setProcessed(@Body() paymentDto: PaymentDto) {
    await this.paymentService.setPaymentsProcessed(paymentDto);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Set status execute for payments.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments executed successfully.',
  })
  async setExecuted(@Body() paymentDto: PaymentDto) {
    await this.paymentService.setPaymentsExecuted(paymentDto);
  }
}
