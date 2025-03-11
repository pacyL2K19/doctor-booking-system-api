import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from '../../common/entities/slot.entity';
import { RecurrenceRule } from '../../common/entities/recurrence-rule.entity';
import { SlotsService } from './slots.service';
import { SlotsController } from './slots.controller';
import { DoctorsModule } from '../doctors/doctors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, RecurrenceRule]), DoctorsModule],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
