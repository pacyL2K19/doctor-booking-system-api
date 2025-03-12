import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { Booking } from '../../common/entities/booking.entity';
import { CreateBookingDto } from '../../common/dtos/create-booking.dto';
import { BookingResponseDto, BookingListDto, BookingSlotDetails } from '../../common/dtos/booking-response.dto';
import { BookingQueryDto } from '../../common/dtos/booking-query.dto';
import { SlotsService } from '../slots/slots.service';
import { SlotStatus } from '../../common/entities/slot.entity';
import * as moment from 'moment';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private slotsService: SlotsService,
    private dataSource: DataSource,
  ) {}

  /**
   * Book a slot by creating a booking and updating the slot status
   * Uses a transaction to ensure atomicity
   */
  async bookSlot(slotId: string, createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
    // Find the slot first to check if it exists and is available
    const slot = await this.slotsService.findSlotById(slotId);
    
    if (slot.status !== SlotStatus.AVAILABLE) {
      throw new ConflictException('Slot is already booked');
    }
    
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Update slot status to booked
      slot.status = SlotStatus.BOOKED;
      await queryRunner.manager.save(slot);
      
      // Create booking
      const booking = this.bookingsRepository.create({
        slot_id: slotId,
        patient_id: createBookingDto.patient_id,
        reason: createBookingDto.reason,
      });
      
      const savedBooking = await queryRunner.manager.save(booking);
      
      // Commit transaction
      await queryRunner.commitTransaction();
      
      // Return formatted response
      return this.mapToBookingResponse(savedBooking, slot);
    } catch (error) {
      // Rollback on error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  /**
   * Get all bookings for a specific doctor within a date range
   * Optimized query with proper indexing on foreign keys and dates
   */
  async findBookingsByDoctor(doctorId: string, query: BookingQueryDto): Promise<BookingListDto> {
    // Validate date range
    let startDate = null;
    let endDate = null;
    
    if (query.start_date) {
      startDate = moment(query.start_date).startOf('day').toDate();
      if (!moment(startDate).isValid()) {
        throw new BadRequestException('Invalid start date format');
      }
    }
    
    if (query.end_date) {
      endDate = moment(query.end_date).endOf('day').toDate();
      if (!moment(endDate).isValid()) {
        throw new BadRequestException('Invalid end date format');
      }
    }
    
    if (startDate && endDate && startDate > endDate) {
      throw new BadRequestException('Start date must be before end date');
    }
    
    // Build the query conditionally
    const whereConditions: any = {};
    
    // Create the slot join query
    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .innerJoinAndSelect('booking.slot', 'slot')
      .where('slot.doctor_id = :doctorId', { doctorId })
      .andWhere(
        startDate && endDate
          ? 'slot.start_time BETWEEN :startDate AND :endDate'
          : startDate
          ? 'slot.start_time >= :startDate'
          : endDate
          ? 'slot.start_time <= :endDate'
          : '1=1', // Always true if no dates provided
        {
          startDate,
          endDate,
        },
      )
      .orderBy('slot.start_time', 'ASC')
      .getMany();
    
    // Map to response DTO
    return {
      bookings: bookings.map(booking => this.mapToBookingResponse(booking)),
      total: bookings.length,
    };
  }

  /**
   * Transform a raw booking entity to a formatted response DTO
   * Can optionally accept a slot entity to reduce database queries
   */
  private mapToBookingResponse(booking: Booking, slotEntity = null): BookingResponseDto {
    const slot = slotEntity || booking.slot;
    
    const slotDetails: BookingSlotDetails = {
      id: slot.id,
      start_time: slot.start_time,
      end_time: slot.end_time,
      status: slot.status,
      doctor_id: slot.doctor_id,
    };
    
    return {
      id: booking.id,
      patient_id: booking.patient_id,
      reason: booking.reason,
      booking_time: booking.booking_time,
      slot: slotDetails,
    };
  }
} 