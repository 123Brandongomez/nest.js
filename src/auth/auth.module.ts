// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsuariosModule } from '../usuarios/usuarios.module';

// Importar módulos comunes
import { AuthCommonModule } from '../common/modules';
import { JwtAuthGuard } from '../common/guards';

@Module({
  imports: [
    // Usar el módulo de autenticación común
    AuthCommonModule.register({
      secret: process.env.JWT_SECRET || 'your_super_secret_key_here',
      expiresIn: process.env.JWT_EXPIRATION_TIME || '1d',
    }),
    TypeOrmModule.forFeature([Usuario]),
    UsuariosModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
