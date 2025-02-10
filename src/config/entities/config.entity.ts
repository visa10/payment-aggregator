import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

type ConfigNames = 'storeCommission';

@Entity({ name: 'config' })
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: ConfigNames;

  @Column({ type: 'float', default: 0 })
  a: number;

  @Column({ type: 'float', default: 0 })
  b: number;

  @Column({ type: 'float', default: 0 })
  d: number;
}
