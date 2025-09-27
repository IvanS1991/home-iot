import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import 'reflect-metadata';
import { Sensor } from './Sensor';

@Entity()
export class Reading {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('bigint')
  timestamp!: number;

  @Column('float')
  value!: number;

  @ManyToOne(() => Sensor)
  @JoinColumn({ name: 'sensor_id' })
  sensor!: Sensor;
}
