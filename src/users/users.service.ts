import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

  public async create(registerData: IRegisterData): Promise<UserModel> {
    const existingUser = await Promise.any([
      this.findByUsername(registerData.username),
      this.findByEmail(registerData.email),
    ]);

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(registerData.password, 10);

    return this.userRepository.create(
      registerData.username,
      registerData.email,
      hashedPassword,
    );
  }
}
