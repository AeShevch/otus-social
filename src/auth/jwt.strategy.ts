import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type {
  IJwtPayload,
  IValidatedPayload,
} from '@otus-social/auth/interfaces/jwt-strategy.interface';
import { EConfig } from '@otus-social/config/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EConfig.JWT_SECRET),
    });
  }

  public validate(payload: IJwtPayload): IValidatedPayload {
    return { userId: payload.sub, username: payload.username };
  }
}
