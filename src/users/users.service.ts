import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '@otus-social/users/dto/create-user.dto';
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

  public async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const existingUser = await Promise.any([
      this.findByUsername(createUserDto.username),
      this.findByEmail(createUserDto.email),
    ]);

    if (existingUser) {
      throw new ConflictException(
        'User with this username or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.userRepository.create(
      createUserDto.username,
      createUserDto.email,
      hashedPassword,
    );
  }
}
