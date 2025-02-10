import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { StoreService } from '../store/store.service';
import { PayoutService } from './payout.service';

@Injectable()
export class PayoutCronService {
  private readonly logger = new Logger(PayoutCronService.name);

  constructor(
    private readonly storeService: StoreService,
    private readonly payoutService: PayoutService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyPayouts(): Promise<void> {
    this.logger.log('Starting daily payout process...');

    try {
      const stores = await this.storeService.getAllStores();
      for (const store of stores) {
        try {
          const result = await this.payoutService.processPayout(store);
          this.logger.log(
            `Payout processed for store ${store.id}: ${JSON.stringify(result)}`,
          );
        } catch (error) {
          this.logger.error(
            `Error processing payout for store ${store.id}: ${error.message}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error retrieving stores: ${error.message}`);
    }
  }
}
