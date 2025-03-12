import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../common/entities/doctor.entity';
import { CreateDoctorDto } from '../../common/dtos/create-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    // Check if doctor with the same username or email already exists
    const existingDoctor = await this.doctorsRepository.findOne({
      where: [
        { username: createDoctorDto.username },
        { email: createDoctorDto.email },
      ],
    });

    if (existingDoctor) {
      if (existingDoctor.username === createDoctorDto.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingDoctor.email === createDoctorDto.email) {
        throw new ConflictException('Email already exists');
      }
    }

    const doctor = this.doctorsRepository.create(createDoctorDto);

    try {
      return await this.doctorsRepository.save(doctor);
    } catch (error) {
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        throw new ConflictException('Username or email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorsRepository.find();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }

    return doctor;
  }
}
