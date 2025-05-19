import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
}
