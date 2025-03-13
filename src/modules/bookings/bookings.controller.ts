import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from '../../common/dtos/create-booking.dto';
import { BookingResponseDto } from '../../common/dtos/booking-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '../../common/decorators/api-standard-response.decorator';
import { PaginatedResult } from '../../common/dtos/pagination.dto';
import { BookingPaginationQueryDto } from '../../common/dtos/booking-pagination-query.dto';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('slots/:slotId/book')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Book a slot' })
  @ApiParam({
    name: 'slotId',
    description: 'The ID of the slot to book',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: CreateBookingDto })
  @ApiStandardResponse({
    status: 201,
    description: 'The slot has been successfully booked.',
    type: BookingResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiStandardErrorResponse({
    status: 409,
    description: 'Slot is already booked.',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Slot not found.',
  })
  async bookSlot(
    @Param('slotId') slotId: string,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    return this.bookingsService.bookSlot(slotId, createBookingDto);
  }

  @Get('doctors/:doctorId/bookings')
  @ApiOperation({
    summary:
      'Get all booked appointments for a doctor within a date range with pagination',
  })
  @ApiParam({
    name: 'doctorId',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'start_date',
    description: 'The start date (YYYY-MM-DD) to filter bookings (inclusive)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'end_date',
    description: 'The end date (YYYY-MM-DD) to filter bookings (inclusive)',
    required: false,
    type: 'string',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (1-based indexing)',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiStandardResponse({
    status: 200,
    description:
      'Paginated list of bookings for the doctor within the specified date range',
    type: BookingResponseDto,
    isArray: true,
    isPaginated: true,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Invalid date format.',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  async findBookingsByDoctor(
    @Param('doctorId') doctorId: string,
    @Query() query: BookingPaginationQueryDto,
  ): Promise<PaginatedResult<BookingResponseDto>> {
    return this.bookingsService.findBookingsByDoctor(doctorId, query);
  }
}
