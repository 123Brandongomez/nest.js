import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

/**
 * Mu00f3dulo de configuraciu00f3n para la aplicaciu00f3n
 */
@Module({})
export class ConfigModule {
  /**
   * Registra el mu00f3dulo de configuraciu00f3n con validaciu00f3n
   * @returns Mu00f3dulo dinu00e1mico configurado
   */
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      exports: [NestConfigModule],
    };
  }
}
