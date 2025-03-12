import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  Max,
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecurrenceType } from '../entities/recurrence-rule.entity';
import { Type } from 'class-transformer';

export class CreateSlotsDto {
  @ApiProperty({
    description: 'The start time of the slots',
    example: '2023-01-01T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @ApiProperty({
    description: 'The end time of the slots',
    example: '2023-01-01T11:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  end_time: string;

  @ApiProperty({
    description: 'The duration of each slot in minutes (15 or 30)',
    example: 30,
    enum: [15, 30],
  })
  @IsNotEmpty()
  @IsInt()
  @Min(15)
  @Max(30)
  @Type(() => Number)
  slot_duration: number;

  @ApiProperty({
    description: 'The type of recurrence',
    example: RecurrenceType.DAILY,
    enum: RecurrenceType,
  })
  @IsNotEmpty()
  @IsEnum(RecurrenceType)
  recurrence_type: RecurrenceType;

  @ApiProperty({
    description:
      'The days of the week for weekly recurrence (0 = Sunday, 6 = Saturday)',
    example: [1, 3, 5],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  @ValidateIf((o) => o.recurrence_type === RecurrenceType.WEEKLY)
  @Type(() => Number)
  days_of_week?: number[];

  @ApiProperty({
    description: 'The end date of the recurrence',
    example: '2023-12-31T23:59:59Z',
  })
  @IsNotEmpty()
  @IsDateString()
  until: string;
}
