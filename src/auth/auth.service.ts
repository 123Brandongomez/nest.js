import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly vendedorRepository: Repository<Usuario>
  ) {}

  /**
   * Autentica a un usuario con su email y contraseña
   * @param email Email del usuario
   * @param contrasena Contraseña del usuario
   * @returns Token de acceso y datos del usuario
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async login(email: string, contrasena: string) {
    console.log(`Intentando login para usuario: ${email}`);
    
    // Buscar usuario por email
    const usuario = await this.vendedorRepository.findOne({
      where: { email },
      relations: ['rol'] // Cargar relación con rol para tener acceso a los permisos
    });

    // Si no existe el usuario o la contraseña no coincide, lanzar excepción
    if (!usuario) {
      console.log(`Usuario no encontrado: ${email}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    console.log(`Usuario encontrado: ${usuario.email}, Rol: ${usuario.rol?.nombre_rol}`);

    // Comparar la contraseña ingresada con el hash almacenado
    const hash = crypto.createHash('sha256').update(contrasena).digest('hex');
    console.log(`Verificando contraseña: ${hash === usuario.contrasena ? 'Correcta' : 'Incorrecta'}`);
    
    if (hash !== usuario.contrasena) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    return this.generarToken(usuario);
  }

  /**
   * Genera un token JWT para un usuario
   * @param usuario Entidad de usuario
   * @returns Token JWT y datos del usuario
   */
  async generarToken(usuario: Usuario) {
    // Crear payload del token
    const payload = {
      sub: usuario.id_usuario, // Usar 'sub' como estándar JWT para el ID
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      email: usuario.email,
      rol_id: usuario.rol_id,
      nombre_rol: usuario.rol?.nombre_rol
    };

    console.log('Generando token con payload:', payload);

    // Devolver token y datos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol_id: usuario.rol_id,
        nombre_rol: usuario.rol?.nombre_rol
        // No incluir datos sensibles como la contraseña
      }
    };
  }
}


