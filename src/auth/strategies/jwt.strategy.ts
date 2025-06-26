import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) {
    // Obtener el secreto JWT antes de llamar a super()
    const jwtSecret = configService.get<string>('JWT_SECRET') || 'your_super_secret_key_here';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Valida el payload del token JWT y devuelve el usuario
   * @param payload Payload del token JWT
   * @returns Usuario validado
   * @throws UnauthorizedException si el usuario no existe
   */
  async validate(payload: any) {
    console.log('JWT Strategy - Validando token:', payload);
    
    // Buscar el usuario en la base de datos para asegurar que sigue existiendo
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: payload.sub },
      relations: ['rol']
    });
    
    console.log('JWT Strategy - Usuario encontrado:', {
      id: usuario?.id_usuario,
      email: usuario?.email,
      rol: usuario?.rol?.nombre_rol
    });
    
    // Si el usuario no existe, lanzar excepción
    if (!usuario) {
      throw new UnauthorizedException('Usuario no válido o token expirado');
    }

    // Devolver los datos del usuario para el request
    return { 
      id_usuario: payload.sub,
      email: payload.email,
      nombre: payload.nombre,
      rol_id: payload.rol_id,
      nombre_rol: payload.nombre_rol || usuario?.rol?.nombre_rol
    };
  }
}
