import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { TipoMaterialService } from './tipo-materiales.service';
import { CreateTipoMaterialeDto } from './dto/create-tipo-materiale.dto';
import { UpdateTipoMaterialeDto } from './dto/update-tipo-materiale.dto';

@Controller('tipo-materiales')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class TipoMaterialesController {
  constructor(private readonly tipoMaterialesService: TipoMaterialService) {}

  @Post()
  @RequirePermiso('tipo-materiales', 'crear')
  create(@Body() createTipoMaterialeDto: CreateTipoMaterialeDto) {
    return this.tipoMaterialesService.create(createTipoMaterialeDto);
  }

  @Get()
  @RequirePermiso('tipo-materiales', 'ver')
  findAll() {
    return this.tipoMaterialesService.findAll();
  }

  @Get(':id')
  @RequirePermiso('tipo-materiales', 'ver')
  findOne(@Param('id') id: string) {
    return this.tipoMaterialesService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('tipo-materiales', 'actualizar')
  update(@Param('id') id: string, @Body() updateTipoMaterialeDto: UpdateTipoMaterialeDto) {
    return this.tipoMaterialesService.update(+id, updateTipoMaterialeDto);
  }

  @Delete(':id')
  @RequirePermiso('tipo-materiales', 'eliminar')
  remove(@Param('id') id: string) {
    return this.tipoMaterialesService.remove(+id);
  }
}
