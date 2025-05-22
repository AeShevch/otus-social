import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@otus-social/auth/auth.controller';
import { AuthService } from '@otus-social/auth/auth.service';
import { JwtStrategy } from '@otus-social/auth/jwt.strategy';
import { EConfig } from '@otus-social/config/types';
import { UsersModule } from '@otus-social/users/users.module';
import { ProfilesModule } from '@otus-social/profiles/profiles.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    UsersModule,
    ProfilesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(EConfig.JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(EConfig.JWT_EXPIRES_IN),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
