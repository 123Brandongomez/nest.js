import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { CaracteristicasService } from './caracteristicas.service';
import { CreateCaracteristicaDto } from './dto/create-caracteristica.dto';
import { UpdateCaracteristicaDto } from './dto/update-caracteristica.dto';

@Controller('caracteristicas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CaracteristicasController {
  constructor(private readonly caracteristicasService: CaracteristicasService) {}

  @Post()
  @RequirePermiso('caracteristicas', 'crear')
  create(@Body() createCaracteristicaDto: CreateCaracteristicaDto) {
    return this.caracteristicasService.create(createCaracteristicaDto);
  }

  @Get()
  @RequirePermiso('caracteristicas', 'ver')
  findAll() {
    return this.caracteristicasService.findAll();
  }

  @Get(':id')
  @RequirePermiso('caracteristicas', 'ver')
  findOne(@Param('id') id: string) {
    return this.caracteristicasService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermiso('caracteristicas', 'actualizar')
  update(@Param('id') id: string, @Body() updateCaracteristicaDto: UpdateCaracteristicaDto) {
    return this.caracteristicasService.update(+id, updateCaracteristicaDto);
  }

  @Delete(':id')
  @RequirePermiso('caracteristicas', 'eliminar')
  remove(@Param('id') id: string) {
    return this.caracteristicasService.remove(+id);
  }
}
