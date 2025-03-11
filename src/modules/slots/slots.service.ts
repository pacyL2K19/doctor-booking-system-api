import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Slot, SlotStatus } from '../../common/entities/slot.entity';
import {
  RecurrenceRule,
  RecurrenceType,
} from '../../common/entities/recurrence-rule.entity';
import { CreateSlotsDto } from '../../common/dtos/create-slots.dto';
import {
  SlotsResponseDto,
  SlotSummary,
} from '../../common/dtos/slots-response.dto';
import { DoctorsService } from '../doctors/doctors.service';
import * as moment from 'moment';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private slotsRepository: Repository<Slot>,
    @InjectRepository(RecurrenceRule)
    private recurrenceRuleRepository: Repository<RecurrenceRule>,
    private doctorsService: DoctorsService,
    private dataSource: DataSource,
  ) {}

  async createSlots(
    doctorId: string,
    createSlotsDto: CreateSlotsDto,
  ): Promise<SlotsResponseDto> {
    // Validate doctor exists
    const doctor = await this.doctorsService.findOne(doctorId);

    // Parse dates
    const startTime = new Date(createSlotsDto.start_time);
    const endTime = new Date(createSlotsDto.end_time);
    const until = new Date(createSlotsDto.until);

    // Validate time range
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (until < startTime) {
      throw new BadRequestException('End date must be after start date');
    }

    // Validate slot duration
    if (
      createSlotsDto.slot_duration !== 15 &&
      createSlotsDto.slot_duration !== 30
    ) {
      throw new BadRequestException(
        'Slot duration must be either 15 or 30 minutes',
      );
    }

    // Validate days of week for weekly recurrence
    if (
      createSlotsDto.recurrence_type === RecurrenceType.WEEKLY &&
      (!createSlotsDto.days_of_week || createSlotsDto.days_of_week.length === 0)
    ) {
      throw new BadRequestException(
        'Days of week are required for weekly recurrence',
      );
    }

    // Calculate total time range in minutes
    const totalMinutes =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    // Calculate number of slots in the time range
    const slotsPerDay = Math.floor(totalMinutes / createSlotsDto.slot_duration);

    if (slotsPerDay <= 0) {
      throw new BadRequestException(
        'Time range is too small for the specified slot duration',
      );
    }

    // Create recurrence rule
    const recurrenceRule = this.recurrenceRuleRepository.create({
      doctor_id: doctorId,
      type: createSlotsDto.recurrence_type,
      start_time: startTime,
      end_time: endTime,
      slot_duration: createSlotsDto.slot_duration,
      days_of_week: createSlotsDto.days_of_week,
      until,
    });

    // Use transaction to ensure all operations succeed or fail together
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Save recurrence rule
      const savedRule = await queryRunner.manager.save(recurrenceRule);

      // Generate slots based on recurrence type
      const slots: Slot[] = [];
      const sampleSlots: SlotSummary[] = [];
      let totalSlots = 0;

      // Start with the first day
      let currentDate = moment(startTime);
      const untilDate = moment(until).endOf('day');

      while (currentDate.isSameOrBefore(untilDate)) {
        // For weekly recurrence, check if current day is in days_of_week
        if (
          createSlotsDto.recurrence_type === RecurrenceType.WEEKLY &&
          !createSlotsDto.days_of_week.includes(currentDate.day())
        ) {
          currentDate = currentDate.add(1, 'day').startOf('day');
          continue;
        }

        // Generate slots for this day
        let slotStart = moment(currentDate)
          .hour(startTime.getHours())
          .minute(startTime.getMinutes())
          .second(0);

        for (let i = 0; i < slotsPerDay; i++) {
          const slotEnd = moment(slotStart).add(
            createSlotsDto.slot_duration,
            'minutes',
          );

          const slot = new Slot();
          slot.doctor_id = doctorId;
          slot.start_time = slotStart.toDate();
          slot.end_time = slotEnd.toDate();
          slot.status = SlotStatus.AVAILABLE;
          slot.recurrence_id = savedRule.id;

          slots.push(slot);

          // Add to sample slots (only first few)
          if (totalSlots < 5) {
            sampleSlots.push({
              start_time: slotStart.toISOString(),
              end_time: slotEnd.toISOString(),
            });
          }

          totalSlots++;
          slotStart = slotEnd;
        }

        // Move to next day for daily and weekly recurrence
        if (createSlotsDto.recurrence_type !== RecurrenceType.ONE_TIME) {
          currentDate = currentDate.add(1, 'day').startOf('day');
        } else {
          // For one-time, we're done after the first day
          break;
        }
      }

      // Save slots in batches to improve performance
      const batchSize = 100;
      for (let i = 0; i < slots.length; i += batchSize) {
        const batch = slots.slice(i, i + batchSize);
        await queryRunner.manager.save(batch);
      }

      await queryRunner.commitTransaction();

      // Return response
      return {
        recurrence_id: savedRule.id,
        recurrence_type: savedRule.type,
        start_date: moment(startTime).format('YYYY-MM-DD'),
        end_date: moment(until).format('YYYY-MM-DD'),
        slot_duration: createSlotsDto.slot_duration,
        total_slots: totalSlots,
        sample_slots: sampleSlots,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findSlotsByDoctor(doctorId: string): Promise<Slot[]> {
    // Check if doctor exists
    await this.doctorsService.findOne(doctorId);

    return this.slotsRepository.find({
      where: { doctor_id: doctorId },
      order: { start_time: 'ASC' },
    });
  }

  async findAvailableSlotsByDoctor(
    doctorId: string,
    date: string,
  ): Promise<Slot[]> {
    // Check if doctor exists
    await this.doctorsService.findOne(doctorId);

    // Parse date
    const searchDate = moment(date);
    if (!searchDate.isValid()) {
      throw new BadRequestException('Invalid date format');
    }

    const startOfDay = searchDate.startOf('day').toDate();
    const endOfDay = searchDate.endOf('day').toDate();

    return this.slotsRepository.find({
      where: {
        doctor_id: doctorId,
        status: SlotStatus.AVAILABLE,
        start_time: MoreThanOrEqual(startOfDay),
        end_time: LessThanOrEqual(endOfDay),
      },
      order: { start_time: 'ASC' },
    });
  }

  async findSlotById(slotId: string): Promise<Slot> {
    const slot = await this.slotsRepository.findOne({
      where: { id: slotId },
    });

    if (!slot) {
      throw new NotFoundException(`Slot with ID ${slotId} not found`);
    }

    return slot;
  }
}
