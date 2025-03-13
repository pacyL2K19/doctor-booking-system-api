import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../constants/pagination.constants';

/**
 * DTO for pagination query parameters
 */
export class PaginationDto {
  @ApiProperty({
    description: 'Page number (1-based indexing)',
    default: DEFAULT_PAGE,
    required: false,
    type: Number,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = DEFAULT_PAGE;

  @ApiProperty({
    description: 'Number of items per page',
    default: DEFAULT_LIMIT,
    required: false,
    type: Number,
    minimum: 1,
    maximum: MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;
}

/**
 * Interface for pagination result with metadata
 */
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Pagination metadata
 */
export class PaginationMeta {
  @ApiProperty({
    description: 'Total number of items',
    example: 42,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPrevious: boolean;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNext: boolean;
}

/**
 * Helper function to create pagination metadata
 */
export function createPaginationMeta(
  total: number,
  paginationDto: PaginationDto,
): PaginationMeta {
  const { page, limit } = paginationDto;
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    perPage: limit,
    totalPages,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
  };
}
