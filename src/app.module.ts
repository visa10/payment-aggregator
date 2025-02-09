import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './store/store.module';
import { TestModule } from './test/test.module';
import { PaymentModule } from './payment/payment.module';

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
    TestModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
