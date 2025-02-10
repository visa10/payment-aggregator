import { ApiProperty } from '@nestjs/swagger';
import { PayoutDto } from './payout.dto';

export class ProcessPayoutResponseDto {
  @ApiProperty({ description: 'Total payout amount' })
  totalPayout: number;

  @ApiProperty({
    description: 'List of payouts',
    type: [PayoutDto],
  })
  listPayments: PayoutDto[];
}
