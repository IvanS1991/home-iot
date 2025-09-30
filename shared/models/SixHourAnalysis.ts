
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class SixHourAnalysis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column('datetime')
  timestamp!: Date;

  @Column('datetime')
  start_time!: Date;

  @Column('datetime')
  end_time!: Date;

  @Column('float')
  min_value!: number;

  @Column('float')
  max_value!: number;

  @Column('float')
  avg_value!: number;

  @Column('int')
  comfort_level!: number; // 1 (low), 2 (medium), 3 (high)

  @Column('int')
  trend!: number; // 1 (rising), 0 (stable), -1 (falling)

  @Column('varchar', { length: 500 })
  expected_changes!: string; // Description of expected changes
}
