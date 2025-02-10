import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PayoutDto {
  @ApiProperty({ description: 'Shop Id' })
  @IsNumber()
  storeId: number;
}
