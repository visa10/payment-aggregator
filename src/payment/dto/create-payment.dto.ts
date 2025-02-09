import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Shop Id' })
  @IsNumber()
  shopId: number;

  @ApiProperty({ description: 'Amount' })
  @IsNumber()
  amount: number;
}
