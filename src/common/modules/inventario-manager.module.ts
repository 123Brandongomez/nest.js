import { Module } from '@nestjs/common';
import { InventarioManagerService } from '../services/inventario-manager.service';
import { InventarioModule } from '../../inventario/inventario.module';

/**
 * Módulo común para la gestión de inventario
 * Proporciona servicios para la gestión del stock de materiales
 */
@Module({
  imports: [
    InventarioModule // Importamos el módulo de inventario para usar su servicio
  ],
  providers: [InventarioManagerService],
  exports: [InventarioManagerService] // Exportamos el servicio para que pueda ser utilizado por otros módulos
})
export class InventarioManagerModule {}
