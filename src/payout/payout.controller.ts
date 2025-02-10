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
import { PayoutDto } from './dto/payout.dto';
import { ProcessPayoutResponse } from './payout.types';

@ApiTags('Payouts')
@Controller('payouts')
export class PayoutController {
  constructor(
    private payoutService: PayoutService,
    private storeService: StoreService,
  ) {}

  @Post(':storeId')
  @ApiOperation({ summary: 'Process payout for a store.' })
  @ApiResponse({ status: 200, description: 'Payout processed successfully.' })
  async processPayout(
    @Param('shopId') { storeId }: PayoutDto,
  ): Promise<ProcessPayoutResponse> {
    const store = await this.storeService.findById(storeId);
    if (!store) {
      throw new HttpException('Shop not found', HttpStatus.NOT_FOUND);
    }
    return await this.payoutService.processPayout(store);
  }
}
