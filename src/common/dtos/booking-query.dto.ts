import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BookingQueryDto {
  @ApiProperty({
    description: 'Start date for filtering bookings (inclusive)',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  start_date?: string;

  @ApiProperty({
    description: 'End date for filtering bookings (inclusive)',
    example: '2023-01-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  end_date?: string;
}
