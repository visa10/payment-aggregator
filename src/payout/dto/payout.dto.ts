import { ApiProperty } from '@nestjs/swagger';

export class PayoutDto {
  @ApiProperty({ description: 'Payment ID' })
  id: number;

  @ApiProperty({ description: 'Payout amount' })
  payout: number;
}
