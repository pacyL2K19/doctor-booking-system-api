import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    description: 'The ID of the patient making the booking',
    example: 'patient123',
  })
  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @ApiProperty({
    description: 'The reason for the booking',
    example: 'Regular check-up',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
