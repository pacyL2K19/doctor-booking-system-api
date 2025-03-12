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
import { AvailableSlotsResponseDto } from '../../common/dtos/available-slots-response.dto';
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
  @ApiOperation({ summary: 'Get all slots for a doctor' })
  @ApiParam({
    name: 'doctorId',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
  })
  @ApiStandardResponse({
    status: 200,
    description: 'List of all slots for the specified doctor',
    type: Slot,
    isArray: true,
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  async findSlotsByDoctor(
    @Param('doctorId') doctorId: string,
  ): Promise<Slot[]> {
    return this.slotsService.findSlotsByDoctor(doctorId);
  }

  @Get('doctors/:doctorId/available_slots')
  @ApiOperation({
    summary: 'Get all available slots for a doctor on a specific date',
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
  @ApiStandardResponse({
    status: 200,
    description:
      'List of all available slots for the doctor on the specified date',
    type: AvailableSlotsResponseDto,
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
    @Query('date') date: string,
  ): Promise<AvailableSlotsResponseDto> {
    return this.slotsService.findAvailableSlotsByDoctor(doctorId, date);
  }
}
