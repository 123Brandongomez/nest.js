import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMovimiento } from './entities/tipos-movimiento.entity';
import { TiposMovimientoService } from './tipos-movimientos.service';
import { TiposMovimientosController } from './tipos-movimientos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMovimiento])],
  controllers: [TiposMovimientosController],
  providers: [TiposMovimientoService],
  exports: [TypeOrmModule],
})
export class TiposMovimientoModule {}