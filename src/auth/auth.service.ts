import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { IJwtResponse } from '@otus-social/auth/interfaces/auth-service.interface';
import type { IRegisterResponse } from '@otus-social/auth/interfaces/register-data.interface';
import type { IRegisterData } from '@otus-social/auth/interfaces/register-data.interface';
import { EConfig } from '@otus-social/config/types';
import type { IUserWithoutPassword } from '@otus-social/users/interfaces/user.interface';
import { UsersService } from '@otus-social/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<IUserWithoutPassword | null> {
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

  public async login(
    username: string,
    password: string,
  ): Promise<IJwtResponse> {
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateJwt(user);
  }

  public async register(
    registerData: IRegisterData,
  ): Promise<IRegisterResponse> {
    const userModel = await this.usersService.create(registerData);
    const user = userModel.toResponse();

    return this.mapToRegisterResponse(user);
  }

  private mapToRegisterResponse(user: IUserWithoutPassword): IRegisterResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
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
