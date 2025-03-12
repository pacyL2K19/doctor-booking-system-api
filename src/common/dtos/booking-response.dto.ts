import { ApiProperty } from '@nestjs/swagger';
import { SlotStatus } from '../entities/slot.entity';

export class BookingSlotDetails {
  @ApiProperty({
    description: 'The ID of the slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The start time of the slot',
    example: '2023-01-01T10:00:00Z',
  })
  start_time: Date;

  @ApiProperty({
    description: 'The end time of the slot',
    example: '2023-01-01T10:30:00Z',
  })
  end_time: Date;

  @ApiProperty({
    description: 'The status of the slot',
    enum: SlotStatus,
    example: SlotStatus.BOOKED,
  })
  status: SlotStatus;

  @ApiProperty({
    description: 'The ID of the doctor who owns this slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  doctor_id: string;
}

export class BookingResponseDto {
  @ApiProperty({
    description: 'The ID of the booking',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the patient who made the booking',
    example: 'patient123',
  })
  patient_id: string;

  @ApiProperty({
    description: 'The reason for the booking',
    example: 'Regular check-up',
    required: false,
  })
  reason?: string;

  @ApiProperty({
    description: 'The timestamp when the booking was made',
    example: '2023-01-01T10:00:00Z',
  })
  booking_time: Date;

  @ApiProperty({
    description: 'The details of the slot that was booked',
    type: BookingSlotDetails,
  })
  slot: BookingSlotDetails;
}

export class BookingListDto {
  @ApiProperty({
    description: 'List of bookings',
    type: [BookingResponseDto],
  })
  bookings: BookingResponseDto[];

  @ApiProperty({
    description: 'Total number of bookings',
    example: 10,
  })
  total: number;
}
