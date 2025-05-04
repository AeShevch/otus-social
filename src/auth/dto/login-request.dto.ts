import { IsNotEmpty, IsString } from 'class-validator';
import type { TUserId } from '@otus-social/auth/types/user-id.type';
import type { ILoginData } from '@otus-social/auth/interfaces/login-data.interface';

export class LoginRequestDto implements ILoginData {
  @IsNotEmpty()
  @IsString()
  id: TUserId;

  @IsNotEmpty()
  @IsString()
  password: string;
}
