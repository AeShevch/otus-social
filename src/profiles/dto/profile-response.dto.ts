import { ApiProperty } from '@nestjs/swagger';

import type { IProfile } from '@otus-social/profiles/interfaces/profile.interface';

export class ProfileResponseDto implements IProfile {
  @ApiProperty({ description: 'Profile ID', example: 1 })
  public id: number;

  @ApiProperty({
    description: 'User ID associated with this profile',
    example: 1,
  })
  public user_id: number;

  @ApiProperty({ description: 'First name', example: 'John', required: false })
  public first_name?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
  public last_name?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '1990-01-01',
    type: 'string',
    format: 'date',
    required: false,
  })
  public birth_date?: Date;

  @ApiProperty({ description: 'Gender', example: 'male', required: false })
  public gender?: string;

  @ApiProperty({
    description: 'Interests',
    example: ['music', 'travel'],
    required: false,
    type: [String],
  })
  public interests?: string[];

  @ApiProperty({
    description: 'City',
    example: 'St. Petersburg',
    required: false,
  })
  public city?: string;
}
