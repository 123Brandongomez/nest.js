import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoMovimiento } from 'src/tipos-movimientos/entities/tipos-movimiento.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { MovimientosService } from './movimientos.service';
import { MovimientosController } from './movimientos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento, Usuario, TipoMovimiento, Material])],
  controllers: [MovimientosController],
  providers: [MovimientosService],
  exports: [TypeOrmModule],
})
export class MovimientosModule {}

