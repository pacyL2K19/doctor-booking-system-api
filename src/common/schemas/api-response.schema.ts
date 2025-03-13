import { ApiProperty } from '@nestjs/swagger';

/**
 * Swagger schema for standard API response
 * @template T - The type of data being returned
 */
export class ApiResponseSchema<T> {
  @ApiProperty({
    description: 'Indicates whether the request was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: 'Human-readable message',
    example: 'Request successful',
  })
  message: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2023-03-11T22:53:48.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Response data',
    // We don't specify a type here as it's generic and will be defined in implementations
  })
  data: T;
}

/**
 * Swagger schema for error details
 */
export class ErrorDetailsSchema {
  @ApiProperty({
    description: 'Error name or type',
    example: 'BadRequestException',
  })
  name: string;

  @ApiProperty({
    description: 'Additional error details',
    example: { field: 'email', message: 'Invalid email format' },
    required: false,
  })
  details?: Record<string, any>;
}

/**
 * Swagger schema for API error response
 */
export class ApiErrorResponseSchema {
  @ApiProperty({
    description: 'Indicates whether the request was successful',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  code: number;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2023-03-11T22:53:48.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Detailed error information',
    type: ErrorDetailsSchema,
    required: false,
  })
  error?: ErrorDetailsSchema;
}

/**
 * Swagger schema for pagination metadata
 */
export class PaginationMetaSchema {
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
 * Swagger schema for paginated data
 * @template T - The type of items in the paginated list
 */
export class PaginatedDataSchema<T> {
  @ApiProperty({
    description: 'List of items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaSchema,
  })
  paginationInfo: PaginationMetaSchema;
}

/**
 * Swagger schema for paginated API response
 * @template T - The type of items in the paginated list
 */
export class PaginatedApiResponseSchema<T> extends ApiResponseSchema<PaginatedDataSchema<T>> {
  // This now extends ApiResponseSchema with PaginatedDataSchema as the generic type
}
