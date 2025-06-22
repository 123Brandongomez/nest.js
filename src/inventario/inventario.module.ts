import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { Inventario } from './entities/inventario.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { Caracteristica } from 'src/caracteristicas/entities/caracteristica.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, Material, Sitio, Caracteristica])
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [InventarioService] // Exportamos el servicio para que pueda ser utilizado por otros módulos
})
export class InventarioModule {}
