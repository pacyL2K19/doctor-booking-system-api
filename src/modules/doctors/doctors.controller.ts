import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from '../../common/dtos/create-doctor.dto';
import { Doctor } from '../../common/entities/doctor.entity';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import {
  ApiStandardResponse,
  ApiStandardErrorResponse,
} from '../../common/decorators/api-standard-response.decorator';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiBody({ type: CreateDoctorDto })
  @ApiStandardResponse({
    status: 201,
    description: 'The doctor has been successfully created.',
    type: Doctor,
  })
  @ApiStandardErrorResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiStandardErrorResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiStandardResponse({
    status: 200,
    description: 'List of all doctors',
    type: Doctor,
    isArray: true,
  })
  async findAll(): Promise<Doctor[]> {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the doctor',
    type: 'string',
    format: 'uuid',
  })
  @ApiStandardResponse({
    status: 200,
    description: 'The doctor with the specified ID',
    type: Doctor,
  })
  @ApiStandardErrorResponse({
    status: 404,
    description: 'Doctor not found.',
  })
  async findOne(@Param('id') id: string): Promise<Doctor> {
    return this.doctorsService.findOne(id);
  }
}
