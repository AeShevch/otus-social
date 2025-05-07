import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '@otus-social/users/users.service';
import { CreateUserDto } from '@otus-social/users/dto/create-user.dto';
import type { IJwtResponse } from '@otus-social/auth/interfaces/auth-service.interface';
import type { IUserWithoutPassword } from '@otus-social/users/interfaces/user.interface';
import { EConfig } from '@otus-social/types/config-service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async validateUser(username: string, password: string): Promise<IUserWithoutPassword | null> {
    const user = await this.usersService.findByUsername(username);
    
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    return user.toResponse();
  }

  public async login(username: string, password: string): Promise<IJwtResponse> {
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    return this.generateJwt(user);
  }

  public async register(createUserDto: CreateUserDto): Promise<IUserWithoutPassword> {
    const user = await this.usersService.create(createUserDto);
    return user.toResponse();
  }

  private generateJwt(user: IUserWithoutPassword): IJwtResponse {
    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get(EConfig.JWT_SECRET),
        expiresIn: this.configService.get(EConfig.JWT_EXPIRES_IN),
      }),
    };
  }
}
