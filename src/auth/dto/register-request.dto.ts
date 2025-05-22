import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';

export class RegisterRequestDto implements IRegisterData {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({
    description: 'Password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  public firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  public lastName?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  public birthDate?: string;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
  })
  @IsOptional()
  @IsString()
  public gender?: string;

  @ApiProperty({
    description: 'Interests',
    example: ['music', 'travel', 'reading'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public interests?: string[];

  @ApiProperty({
    description: 'City',
    example: 'Saint Petersburg',
  })
  @IsOptional()
  @IsString()
  public city?: string;
}
