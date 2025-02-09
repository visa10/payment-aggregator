import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentStatus } from '../payment-status.enum';
import { StoreEntity } from '../../store/entities/store.entity';

@Entity({ name: 'payment' })
export class PaymentEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => StoreEntity, (store) => store.payments)
  store: StoreEntity;
}
