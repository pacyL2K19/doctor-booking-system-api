import { ApiProperty } from '@nestjs/swagger';

export class SlotTimeInfo {
  @ApiProperty({
    description: 'The ID of the slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The ID of the doctor who owns this slot',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  doctor_id: string;

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
    description:
      'The recurrence rule ID if this slot is part of a recurring series',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  recurrence_id: string;
}

export class AvailableSlotsResponseDto {
  @ApiProperty({
    description: 'The date for which slots are being returned',
    example: '2023-01-01',
  })
  date: string;

  @ApiProperty({
    description: 'The ID of the doctor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  doctor_id: string;

  @ApiProperty({
    description: 'Total number of available slots',
    example: 10,
  })
  total_slots: number;

  @ApiProperty({
    description: 'List of available slots',
    type: [SlotTimeInfo],
  })
  slots: SlotTimeInfo[];
}
