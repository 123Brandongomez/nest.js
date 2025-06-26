import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

/**
 * Módulo global para aplicar guards a toda la aplicación
 * Este módulo aplica el JwtAuthGuard a todas las rutas automáticamente
 */
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class GlobalGuardsModule {}
