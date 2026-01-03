
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';
import { EVENT_STATUS, EVENT_TYPE } from '../constants/events';

@Entity()
export class Events {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('datetime')
  timestamp!: Date;

  @Column({ type: 'enum', enum: [EVENT_STATUS.success, EVENT_STATUS.error, EVENT_STATUS.info] })
  status!: string;

  @Column({ type: 'enum', enum: [EVENT_TYPE.sensor, EVENT_TYPE.serial, EVENT_TYPE.tcp, EVENT_TYPE.http, EVENT_TYPE.system] })
  type!: string;

  @Column({ type: 'varchar', length: 1000 })
  text!: string;
}
