import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from '../../payment/entities/payment.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  platformCommission: number;

  @OneToMany(() => Payment, (payment) => payment.store)
  payments: Payment[];
}
