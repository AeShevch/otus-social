import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { AuthService } from '@otus-social/auth/auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@otus-social/auth/dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this username or email already exists',
  })
  @Post('register')
  public async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const registerResult = await this.authService.register(registerDto);

    return plainToInstance(RegisterResponseDto, registerResult);
  }

  @ApiOperation({ summary: 'Login to the system' })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  public async login(
    @Body() loginDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const loginResult = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    return plainToInstance(LoginResponseDto, loginResult);
  }
}
