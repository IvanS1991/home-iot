import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  vendor!: string;

  @Column()
  model!: string;

  @Column()
  type!: string;
}