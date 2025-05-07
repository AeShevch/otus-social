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
  RegisterRequestDto,
  RegisterResponseDto,
} from '@otus-social/auth/dto';
import type { IValidatedPayload } from '@otus-social/auth/interfaces/jwt-strategy.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
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
