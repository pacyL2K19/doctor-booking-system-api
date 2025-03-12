import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from './doctor.entity';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
}

@Entity('slots')
export class Slot {
  @ApiProperty({
    description: 'The unique identifier of the slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The doctor who owns this slot',
    type: () => Doctor,
  })
  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ApiProperty({
    description: 'The ID of the doctor who owns this slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  doctor_id: string;

  @ApiProperty({
    description: 'The start time of the slot',
    example: '2023-01-01T10:00:00Z',
  })
  @Column({ type: 'timestamp with time zone' })
  start_time: Date;

  @ApiProperty({
    description: 'The end time of the slot',
    example: '2023-01-01T10:30:00Z',
  })
  @Column({ type: 'timestamp with time zone' })
  end_time: Date;

  @ApiProperty({
    description: 'The status of the slot',
    enum: SlotStatus,
    example: SlotStatus.AVAILABLE,
  })
  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE,
  })
  status: SlotStatus;

  @ApiProperty({
    description:
      'The recurrence rule ID if this slot is part of a recurring series',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Column({ nullable: true })
  recurrence_id: string;

  @ApiProperty({
    description: 'The date when the slot was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the slot was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
