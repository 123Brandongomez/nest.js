import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Mu00f3dulo para la configuraciu00f3n de la base de datos
 */
@Module({})
export class DatabaseModule {
  /**
   * Registra el mu00f3dulo de base de datos con configuraciu00f3n desde variables de entorno
   * @returns Mu00f3dulo dinu00e1mico configurado
   */
  static register(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
            synchronize: true
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
