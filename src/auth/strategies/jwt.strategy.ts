import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_super_secret_key_here',
    });
  }

  /**
   * Valida el payload del token JWT y devuelve el usuario
   * @param payload Payload del token JWT
   * @returns Usuario validado
   * @throws UnauthorizedException si el usuario no existe
   */
  async validate(payload: any) {
    // Buscar el usuario en la base de datos para asegurar que sigue existiendo
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: payload.sub },
      relations: ['rol']
    });

    // Si el usuario no existe, lanzar excepción
    if (!usuario) {
      throw new UnauthorizedException('Usuario no válido o token expirado');
    }

    // Devolver los datos del usuario para el request
    return { 
      userId: payload.sub,
      nombre: payload.nombre,
      email: payload.email,
      rol: payload.rol,
      // Añadir datos adicionales si es necesario
    };
  }
}
