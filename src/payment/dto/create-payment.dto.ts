import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Shop Id', example: 1 })
  @IsNumber()
  storeId: number;

  @ApiProperty({ description: 'Amount', example: 100 })
  @IsNumber()
  @IsPositive()
  amount: number;
}
