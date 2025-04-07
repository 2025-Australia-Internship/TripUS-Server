import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import _ from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly UsersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    const user = await this.UsersService.findUserByEmail(payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}
