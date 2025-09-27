
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class Reading {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('datetime')
  timestamp!: Date;

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
