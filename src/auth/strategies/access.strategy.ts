import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../type/jwt.payload';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
