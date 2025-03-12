import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'The username of the doctor',
    example: 'drsmith',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The first name of the doctor',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the doctor',
    example: 'Smith',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'The email of the doctor',
    example: 'john.smith@clinic.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
