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
import {
  BookingResponseDto,
  BookingListDto,
} from '../../common/dtos/booking-response.dto';
import { BookingQueryDto } from '../../common/dtos/booking-query.dto';
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
    summary: 'Get all booked appointments for a doctor within a date range',
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
  @ApiStandardResponse({
    status: 200,
    description:
      'List of all bookings for the doctor within the specified date range',
    type: BookingListDto,
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
    @Query() query: BookingQueryDto,
  ): Promise<BookingListDto> {
    return this.bookingsService.findBookingsByDoctor(doctorId, query);
  }
}
