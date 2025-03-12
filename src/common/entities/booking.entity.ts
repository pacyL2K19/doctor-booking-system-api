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
import { Slot } from './slot.entity';

@Entity('bookings')
export class Booking {
  @ApiProperty({
    description: 'The unique identifier of the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The slot that was booked',
    type: () => Slot,
  })
  @ManyToOne(() => Slot, { eager: true })
  @JoinColumn({ name: 'slot_id' })
  slot: Slot;

  @ApiProperty({
    description: 'The ID of the slot that was booked',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Column()
  slot_id: string;

  @ApiProperty({
    description: 'The ID of the patient who made the booking',
    example: 'patient123',
  })
  @Column()
  patient_id: string;

  @ApiProperty({
    description: 'The reason for the booking',
    example: 'Regular check-up',
  })
  @Column({ nullable: true })
  reason: string;

  @ApiProperty({
    description: 'The timestamp when the booking was made',
    example: '2023-01-01T10:00:00Z',
  })
  @CreateDateColumn({ name: 'booking_time' })
  booking_time: Date;

  @ApiProperty({
    description: 'The date when the booking was created',
    example: '2023-01-01T10:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the booking was last updated',
    example: '2023-01-01T10:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
