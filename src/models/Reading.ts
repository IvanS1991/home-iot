
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class Readings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('datetime')
  timestamp!: Date;

  @Column('float')
  vref!: number;

  @Column()
  adcMax!: number;

  @Column()
  pin!: number;

  @Column({ type: 'varchar', length: 100 })
  vendor!: string;

  @Column({ type: 'varchar', length: 100 })
  model!: string;

  @Column()
  type!: string;

  @Column('float')
  value!: number;
}
