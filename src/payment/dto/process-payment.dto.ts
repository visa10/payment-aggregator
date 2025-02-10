import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty({
    description: 'Array of Payment Ids',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  paymentIds: number[];
}
