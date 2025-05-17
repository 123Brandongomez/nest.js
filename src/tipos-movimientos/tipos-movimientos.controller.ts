import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiposMovimientoService } from './tipos-movimientos.service';
import { CreateTiposMovimientoDto } from './dto/create-tipos-movimiento.dto';
import { UpdateTiposMovimientoDto } from './dto/update-tipos-movimiento.dto';

@Controller('tipos-movimientos')
export class TiposMovimientosController {
  constructor(private readonly tiposMovimientosService: TiposMovimientoService) {}

  @Post()
  create(@Body() createTiposMovimientoDto: CreateTiposMovimientoDto) {
    return this.tiposMovimientosService.create(createTiposMovimientoDto);
  }

  @Get()
  findAll() {
    return this.tiposMovimientosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiposMovimientosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiposMovimientoDto: UpdateTiposMovimientoDto) {
    return this.tiposMovimientosService.update(+id, updateTiposMovimientoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiposMovimientosService.remove(+id);
  }
}
