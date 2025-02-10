import {
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayoutService } from './payout.service';
import { StoreService } from '../store/store.service';
import { ProcessPayoutResponseDto } from './dto/payout-response.dto';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutController {
  constructor(
    private payoutService: PayoutService,
    private storeService: StoreService,
  ) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Process payout for a store.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payout processed successfully.',
    type: ProcessPayoutResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Shop not found',
  })
  async processPayout(
    @Param('storeId') storeId: string,
  ): Promise<ProcessPayoutResponseDto> {
    const store = await this.storeService.findById(Number(storeId));
    if (!store) {
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
    return await this.payoutService.processPayout(store);
  }
}
