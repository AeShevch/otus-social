import { IsNotEmpty, IsString } from 'class-validator';

import type { ILoginData } from '@otus-social/auth/interfaces/login-data.interface';

export class LoginRequestDto implements ILoginData {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
