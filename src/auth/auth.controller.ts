import { Controller, Post, Body, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';
import { UsuariosService } from '../usuarios/usuarios.service';

@Controller('')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService
  ) {}

  @Post('registrar')
  async registrar(@Body() createUsuarioDto: CreateUsuarioDto) {
    try {
      // Puedes ajustar valores por defecto aquí si es necesario
      const usuario = await this.usuariosService.create(createUsuarioDto);
      return {
        message: 'Usuario registrado exitosamente',
        usuario,
      };
    } catch (error) {
      this.logger.error(`Error en registro: ${error.message}`);
      throw new BadRequestException('Error al registrar usuario: ' + error.message);
    }
  }

  @Post('validacion')
  async login(@Body() loginDto: LoginDto) {
    try {
      this.logger.log(`Intento de login con email: ${loginDto.email}`);
      
      if (!loginDto.email || !loginDto.contrasena) {
        throw new BadRequestException('Email y contraseña son requeridos');
      }
      
      const result = await this.authService.login(
        loginDto.email,
        loginDto.contrasena,
      );

      if (!result) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Devolver directamente el token y los datos del usuario sin estructura adicional
      // para que coincida con lo que espera el frontend
      return {
        message: 'Inicio de sesión exitoso',
        token: result.access_token,
        user: result.usuario
      };
    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`);
      if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Error en la validación de credenciales');
    }
  }
}
