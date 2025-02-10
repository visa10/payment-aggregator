import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment' })
export class ConfigEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  a: number;

  @Column({ type: 'float', default: 0 })
  b: number;

  @Column({ type: 'float', default: 0 })
  d: number;
}
