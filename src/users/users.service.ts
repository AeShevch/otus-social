import { Injectable } from '@nestjs/common';

import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { UserModel } from '@otus-social/users/models/user.model';
import { UserRepository } from '@otus-social/users/repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async findById(id: number): Promise<UserModel | null> {
    return this.userRepository.findById(id);
  }

  public async findByUsername(username: string): Promise<UserModel | null> {
    return this.userRepository.findByUsername(username);
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return this.userRepository.findByEmail(email);
  }

  public async create(
    userData: Pick<IRegisterData, 'username' | 'email'>,
    hashedPassword: string,
  ): Promise<UserModel> {
    return this.userRepository.create(userData, hashedPassword);
  }
}
