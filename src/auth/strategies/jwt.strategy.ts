import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || process.env.AUT_SECRET || 'your_super_secret_key_here',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.userId,
      nombre: payload.nombre,
      email: payload.email,
      rol: payload.rol
    };
  }
}
