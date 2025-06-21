import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaracteristicasService } from './caracteristicas.service';
import { CaracteristicasController } from './caracteristicas.controller';
import { Caracteristica } from './entities/caracteristica.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { InventarioManagerModule } from '../common/modules/inventario-manager.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Caracteristica, Material]),
    InventarioManagerModule // Importamos el módulo común de gestión de inventario
  ],
  controllers: [CaracteristicasController],
  providers: [CaracteristicasService],
})
export class CaracteristicasModule {}
