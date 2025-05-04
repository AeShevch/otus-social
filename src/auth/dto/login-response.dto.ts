import { IsNotEmpty, IsString } from 'class-validator';
import type { ILoginResponse } from '@otus-social/auth/interfaces/login-data.interface';

export class LoginResponseDto implements ILoginResponse {
  @IsNotEmpty()
  @IsString()
  token: string;
}
