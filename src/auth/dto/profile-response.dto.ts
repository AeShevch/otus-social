import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import type { IProfile } from '@otus-social/auth/interfaces/profile.interface';

export class ProfileResponseDto implements IProfile {
  @IsNumber()
  @IsNotEmpty()
  public userId: number;

  @IsString()
  @IsNotEmpty()
  public username: string;
}
