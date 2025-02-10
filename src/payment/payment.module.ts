import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), StoreModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
