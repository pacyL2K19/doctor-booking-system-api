import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('doctors')
export class Doctor {
  @ApiProperty({
    description: 'The unique identifier of the doctor',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The username of the doctor',
    example: 'drsmith',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'The first name of the doctor',
    example: 'John',
  })
  @Column()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the doctor',
    example: 'Smith',
  })
  @Column()
  last_name: string;

  @ApiProperty({
    description: 'The email of the doctor',
    example: 'john.smith@clinic.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The date when the doctor was created',
    example: '2023-01-01T00:00:00Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the doctor was last updated',
    example: '2023-01-01T00:00:00Z',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
