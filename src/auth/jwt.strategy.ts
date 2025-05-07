import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { IJwtPayload, IValidatedPayload } from '@otus-social/auth/interfaces/jwt-strategy.interface';
import { EConfig } from '@otus-social/types/config-service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
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
