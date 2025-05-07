import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';

export class RegisterRequestDto implements IRegisterData {
  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  public password: string;
}
