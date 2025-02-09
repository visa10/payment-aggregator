import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentResponseDto {
  @ApiProperty({ description: 'Payment id' })
  paymentId: number;
}
