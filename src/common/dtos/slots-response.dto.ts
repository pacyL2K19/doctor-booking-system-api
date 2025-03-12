import { ApiProperty } from '@nestjs/swagger';
import { RecurrenceType } from '../entities/recurrence-rule.entity';

export class SlotSummary {
  @ApiProperty({
    description: 'The start time of the slot',
    example: '2023-01-01T10:00:00Z',
  })
  start_time: string;

  @ApiProperty({
    description: 'The end time of the slot',
    example: '2023-01-01T10:30:00Z',
  })
  end_time: string;
}

export class SlotsResponseDto {
  @ApiProperty({
    description: 'The ID of the recurrence rule',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  recurrence_id: string;

  @ApiProperty({
    description: 'The type of recurrence',
    enum: RecurrenceType,
    example: RecurrenceType.DAILY,
  })
  recurrence_type: RecurrenceType;

  @ApiProperty({
    description: 'The start date of the recurrence',
    example: '2023-01-01',
  })
  start_date: string;

  @ApiProperty({
    description: 'The end date of the recurrence',
    example: '2023-12-31',
  })
  end_date: string;

  @ApiProperty({
    description: 'The duration of each slot in minutes',
    example: 30,
  })
  slot_duration: number;

  @ApiProperty({
    description: 'The total number of slots created',
    example: 100,
  })
  total_slots: number;

  @ApiProperty({
    description: 'Sample of the first few slots created',
    type: [SlotSummary],
  })
  sample_slots: SlotSummary[];
}
