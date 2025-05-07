import type { IRegisterResponse } from '@otus-social/auth/interfaces/register-data.interface';

export class RegisterResponseDto implements IRegisterResponse {
  public id: number;
  public username: string;
  public email: string;
  public created_at: Date;
  public updated_at: Date;
}
