import { Module, DynamicModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

/**
 * Módulo de autenticación común
 */
@Module({})
export class AuthCommonModule {
  /**
   * Registra el módulo de autenticación con configuración personalizada
   * @param options Opciones de configuración para JWT
   * @returns Módulo dinámico configurado
   */
  static register(options?: {
    secret?: string;
    expiresIn?: string;
  }): DynamicModule {
    return {
      module: AuthCommonModule,
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: options?.secret || process.env.JWT_SECRET || 'secretKey',
          signOptions: {
            expiresIn: options?.expiresIn || process.env.JWT_EXPIRATION_TIME || '1d',
          },
        }),
      ],
      exports: [PassportModule, JwtModule],
    };
  }
}
