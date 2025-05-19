import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import type { ILoginData } from '@otus-social/auth/interfaces/login-data.interface';

export class LoginRequestDto implements ILoginData {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  @IsNotEmpty()
  @IsString()
  public username: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
