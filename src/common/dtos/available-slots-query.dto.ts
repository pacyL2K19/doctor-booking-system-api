import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

/**
 * DTO for available slots query parameters
 */
export class AvailableSlotsQueryDto extends PaginationDto {
  @ApiProperty({
    description: 'The date to check for available slots (YYYY-MM-DD)',
    example: '2023-01-01',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  date: string;
}