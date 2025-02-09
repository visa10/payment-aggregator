import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentEntity } from '../../payment/entities/payment.entity';

@Entity({ name: 'store' })
export class StoreEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  platformCommission: number;

  @OneToMany(() => PaymentEntity, (payment) => payment.store)
  payments: PaymentEntity[];
}
