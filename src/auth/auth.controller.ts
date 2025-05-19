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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '@otus-social/auth/auth.service';
import {
  LoginRequestDto,
  LoginResponseDto,
  ProfileResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@otus-social/auth/dto';
import type { IValidatedPayload } from '@otus-social/auth/interfaces/jwt-strategy.interface';

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
    return this.authService.register(registerDto);
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
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
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
