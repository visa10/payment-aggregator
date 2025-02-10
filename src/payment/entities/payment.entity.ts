import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatus } from '../payment-status.enum';
import { Store } from '../../store/entities/store.entity';

@Entity({ name: 'payment' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.ACCEPTED,
  })
  status: PaymentStatus;

  // Sum that has already been paid out from this payment
  @Column({ type: 'float', default: 0 })
  paidAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Store, (store) => store.payments)
  store: Store;
}
