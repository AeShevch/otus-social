import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from '@otus-social/auth/auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  ProfileResponseDto,
} from '@otus-social/auth/dto';
import type { IValidatedPayload } from '@otus-social/auth/interfaces/jwt-strategy.interface';
import { CreateUserDto } from '@otus-social/users/dto/create-user.dto';
import type { IUserWithoutPassword } from '@otus-social/users/interfaces/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserWithoutPassword> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  public async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  public getProfile(
    @Request() req: { user: IValidatedPayload },
  ): ProfileResponseDto {
    return {
      userId: req.user.userId,
      username: req.user.username,
    };
  }
}
