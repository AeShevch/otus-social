import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@otus-social/auth/auth.service';
import { LoginRequestDto, LoginResponseDto } from '@otus-social/auth/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(payload);
  }
}
