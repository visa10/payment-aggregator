import { Module } from '@nestjs/common';
import { PayoutService } from './payout.service';
import { PayoutController } from './payout.controller';
import { ConfigModule } from '../config/config.module';
import { PaymentModule } from '../payment/payment.module';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [ConfigModule, PaymentModule, StoreModule],
  providers: [PayoutService],
  controllers: [PayoutController],
})
export class PayoutModule {}
