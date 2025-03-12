import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from './doctor.entity';
import { Slot } from './slot.entity';

export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  ONE_TIME = 'one_time',
}

@Entity('recurrence_rules')
export class RecurrenceRule {
  @ApiProperty({
    description: 'The unique identifier of the recurrence rule',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The doctor who owns this recurrence rule',
    type: () => Doctor,
  })
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ApiProperty({
    description: 'The ID of the doctor who owns this recurrence rule',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  doctor_id: string;

  @ApiProperty({
    description: 'The type of recurrence',
    enum: RecurrenceType,
    example: RecurrenceType.DAILY,
  })
  @Column({
    type: 'enum',
    enum: RecurrenceType,
  })
  type: RecurrenceType;

  @ApiProperty({
    description: 'The start time of the first slot in the series',
    example: '2023-01-01T10:00:00Z',
  })
  @Column({ type: 'timestamp with time zone' })
  start_time: Date;

  @ApiProperty({
    description: 'The end time of the first slot in the series',
    example: '2023-01-01T11:30:00Z',
  })
  @Column({ type: 'timestamp with time zone' })
  end_time: Date;

  @ApiProperty({
    description: 'The duration of each slot in minutes',
    example: 30,
  })
  @Column()
  slot_duration: number;

  @ApiProperty({
    description:
      'The days of the week for weekly recurrence (0 = Sunday, 6 = Saturday)',
    example: [1, 3, 5],
    required: false,
  })
  @Column('int', { array: true, nullable: true })
  days_of_week: number[];

  @ApiProperty({
    description: 'The end date of the recurrence',
    example: '2023-12-31T23:59:59Z',
  })
  @Column({ type: 'timestamp with time zone' })
  until: Date;

  @ApiProperty({
    description: 'The date when the recurrence rule was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the recurrence rule was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Slot, (slot) => slot.recurrence_id)
  slots: Slot[];
}
