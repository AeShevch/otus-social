import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import type { IProfile } from '@otus-social/auth/interfaces/profile.interface';

export class ProfileResponseDto implements IProfile {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  public username: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  public firstName?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  public lastName?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '1990-01-01',
  })
  @IsDate()
  @IsOptional()
  public birthDate?: Date;

  @ApiProperty({
    description: 'Gender',
    example: 'male',
  })
  @IsString()
  @IsOptional()
  public gender?: string;

  @ApiProperty({
    description: 'Interests',
    example: ['music', 'travel', 'reading'],
  })
  @IsArray()
  @IsString({ each: true })
  public interests?: string[];

  @ApiProperty({
    description: 'City',
    example: 'Saint Petersburg',
  })
  @IsString()
  @IsOptional()
  public city?: string;
}
