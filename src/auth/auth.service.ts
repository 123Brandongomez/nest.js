import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity'; // Asegúrate de que esta entidad exista
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Usuario)
    private readonly vendedorRepository: Repository<Usuario>,
    private readonly configService: ConfigService,
  ) {
    console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));
  }

  async login(email: string, contrasena: string) {
    const usuarios = await this.vendedorRepository.findOne({
      where: { email },
    });

    if (!usuarios) {
      return null;
    }

    // Comparar la contraseña ingresada con el hash usando bcryptjs
    const passwordMatch = await bcrypt.compare(contrasena, usuarios.contrasena);
    if (!passwordMatch) {
      return null;
    }

    return this.generarToken(usuarios);
  }

  async generarToken(usuarios: Usuario) {
    const payload = {
      userId: usuarios.id_usuario,
      nombre: usuarios.nombre,
      email: usuarios.email,
      rol: usuarios.rol_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuarios: {
        id_usuario: usuarios.id_usuario,
        nombre: usuarios.nombre,
        email: usuarios.email,
        rol_id: usuarios.rol_id
      }
    };
  }
}


