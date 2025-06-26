import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { TipoSitiosService } from './tipo-sitios.service';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';

@Controller('tipo-sitios')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TipoSitiosController {
  constructor(private readonly tipoSitiosService: TipoSitiosService) {}

  @Post()
  @RequirePermiso('tipo-sitios', 'crear')
  create(@Body() createTipoSitioDto: CreateTipoSitioDto) {
    return this.tipoSitiosService.create(createTipoSitioDto);
  }

  @Get()
  @RequirePermiso('tipo-sitios', 'ver')
  findAll() {
    return this.tipoSitiosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('tipo-sitios', 'ver')
  findOne(@Param('id') id: string) {
    return this.tipoSitiosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('tipo-sitios', 'actualizar')
  update(@Param('id') id: string, @Body() updateTipoSitioDto: UpdateTipoSitioDto) {
    return this.tipoSitiosService.update(+id, updateTipoSitioDto);
  }

  @Delete(':id')
  @RequirePermiso('tipo-sitios', 'eliminar')
  remove(@Param('id') id: string) {
    return this.tipoSitiosService.remove(+id);
  }
}
