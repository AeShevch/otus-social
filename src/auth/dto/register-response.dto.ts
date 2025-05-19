import { ApiProperty } from '@nestjs/swagger';

import type { IRegisterResponse } from '@otus-social/auth/interfaces/register-data.interface';

export class RegisterResponseDto implements IRegisterResponse {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  public id: number;

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  public username: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john@example.com',
  })
  public email: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  public created_at: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  public updated_at: Date;
}
