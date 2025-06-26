import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { SitioService } from './sitios.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Controller('sitios')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SitiosController {
  constructor(private readonly sitiosService: SitioService) {}

  @Post()
  @RequirePermiso('sitios', 'crear')
  create(@Body() createSitioDto: CreateSitioDto) {
    return this.sitiosService.create(createSitioDto);
  }

  @Get()
  @RequirePermiso('sitios', 'ver')
  findAll() {
    return this.sitiosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('sitios', 'ver')
  findOne(@Param('id') id: string) {
    return this.sitiosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('sitios', 'actualizar')
  update(@Param('id') id: string, @Body() updateSitioDto: UpdateSitioDto) {
    return this.sitiosService.update(+id, updateSitioDto);
  }

  @Delete(':id')
  @RequirePermiso('sitios', 'eliminar')
  remove(@Param('id') id: string) {
    return this.sitiosService.remove(+id);
  }
}
