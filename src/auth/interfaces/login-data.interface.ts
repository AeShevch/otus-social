import type { TUserId } from '@otus-social/auth/types/user-id.type';

export interface ILoginData {
  id: TUserId;
  password: string;
}

export interface ILoginResponse {
  token: string;
}
