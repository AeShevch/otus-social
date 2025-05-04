import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  ILoginData,
  ILoginResponse,
} from '@otus-social/auth/interfaces/login-data.interface';

@Injectable()
export class AuthService {
  async login(loginData: ILoginData): Promise<ILoginResponse> {
    await Promise.resolve();

    if (loginData.id !== 'user123') {
      throw new NotFoundException('Пользователь не найден');
    }

    return {
      token: uuid(),
    };
  }
}
