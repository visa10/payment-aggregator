import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule } from './config/config.module';
import { PayoutModule } from './payout/payout.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'valerijmancenko',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'payment_aggregator',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StoreModule,
    PaymentModule,
    ConfigModule,
    PayoutModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
