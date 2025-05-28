import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InformesController } from './informes.controller';
import { InformesService } from './informes.service';
import { Material } from '../materiales/entities/materiale.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { TipoMovimiento } from '../tipos-movimientos/entities/tipos-movimiento.entity';
import { Sede } from '../sedes/entities/sede.entity';
import { Area } from '../areas/entities/area.entity';
import { Centro } from '../centros/entities/centro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Material,
      Usuario,
      Movimiento,
      Sitio,
      TipoMovimiento,
      Sede,
      Area,
      Centro
    ]),
  ],
  controllers: [InformesController],
  providers: [InformesService],
  exports: [InformesService],
})
export class InformesModule {}
