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
import { SlotsService } from './slots.service';
import { CreateSlotsDto } from '../../common/dtos/create-slots.dto';
import { SlotsResponseDto } from '../../common/dtos/slots-response.dto';
import { Slot } from '../../common/entities/slot.entity';
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
import {
  PaginationDto,
  PaginatedResult,
} from '../../common/dtos/pagination.dto';
import { AvailableSlotsQueryDto } from '../../common/dtos/available-slots-query.dto';

@ApiTags('slots')
@Controller()
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post('doctors/:doctorId/slots')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create slots for a doctor' })
  @ApiParam({
    name: 'doctorId',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: CreateSlotsDto })
  @ApiStandardResponse({
    status: 201,
    description: 'The slots have been successfully created.',
    type: SlotsResponseDto,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  async createSlots(
    @Param('doctorId') doctorId: string,
    @Body() createSlotsDto: CreateSlotsDto,
  ): Promise<SlotsResponseDto> {
    return this.slotsService.createSlots(doctorId, createSlotsDto);
  }

  @Get('doctors/:doctorId/slots')
  @ApiOperation({ summary: 'Get all slots for a doctor with pagination' })
  @ApiParam({
    name: 'doctorId',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
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
    description: 'Paginated list of slots for the specified doctor',
    type: Slot,
    isArray: true,
    isPaginated: true,
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  async findSlotsByDoctor(
    @Param('doctorId') doctorId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Slot>> {
    return this.slotsService.findSlotsByDoctor(doctorId, paginationDto);
  }

  @Get('doctors/:doctorId/available_slots')
  @ApiOperation({
    summary:
      'Get available slots for a doctor on a specific date with pagination',
  })
  @ApiParam({
    name: 'doctorId',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'date',
    description: 'The date to check for available slots (YYYY-MM-DD)',
    type: 'string',
    required: true,
    example: '2023-01-01',
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
      'Paginated list of available slots for the doctor on the specified date',
    type: Slot,
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
  async findAvailableSlotsByDoctor(
    @Param('doctorId') doctorId: string,
    @Query() query: AvailableSlotsQueryDto,
  ): Promise<PaginatedResult<Slot>> {
    return this.slotsService.findAvailableSlotsByDoctor(
      doctorId,
      query.date,
      query,
    );
  }
}
