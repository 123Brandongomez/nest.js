import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Controller('movimientos')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  @RequirePermiso('movimientos', 'crear')
  create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.create(createMovimientoDto);
  }

  @Get()
  @RequirePermiso('movimientos', 'ver')
  findAll() {
    return this.movimientosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('movimientos', 'ver')
  findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('movimientos', 'actualizar')
  update(@Param('id') id: string, @Body() updateMovimientoDto: UpdateMovimientoDto) {
    return this.movimientosService.update(+id, updateMovimientoDto);
  }

  @Delete(':id')
  @RequirePermiso('movimientos', 'eliminar')
  remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id);
  }
}
