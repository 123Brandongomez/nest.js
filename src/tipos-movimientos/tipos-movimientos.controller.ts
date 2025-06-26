import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { TiposMovimientoService } from './tipos-movimientos.service';
import { CreateTiposMovimientoDto } from './dto/create-tipos-movimiento.dto';
import { UpdateTiposMovimientoDto } from './dto/update-tipos-movimiento.dto';

@Controller('tipos-movimientos')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TiposMovimientosController {
  constructor(private readonly tiposMovimientosService: TiposMovimientoService) {}

  @Post()
  @RequirePermiso('tipos-movimientos', 'crear')
  create(@Body() createTiposMovimientoDto: CreateTiposMovimientoDto) {
    return this.tiposMovimientosService.create(createTiposMovimientoDto);
  }

  @Get()
  @RequirePermiso('tipos-movimientos', 'ver')
  findAll() {
    return this.tiposMovimientosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('tipos-movimientos', 'ver')
  findOne(@Param('id') id: string) {
    return this.tiposMovimientosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('tipos-movimientos', 'actualizar')
  update(@Param('id') id: string, @Body() updateTiposMovimientoDto: UpdateTiposMovimientoDto) {
    return this.tiposMovimientosService.update(+id, updateTiposMovimientoDto);
  }

  @Delete(':id')
  @RequirePermiso('tipos-movimientos', 'eliminar')
  remove(@Param('id') id: string) {
    return this.tiposMovimientosService.remove(+id);
  }
}
