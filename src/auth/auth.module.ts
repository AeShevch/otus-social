import { Module } from '@nestjs/common';
import { AuthController } from '@otus-social/auth/auth.controller';
import { AuthService } from '@otus-social/auth/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
