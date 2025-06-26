import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { MunicipiosService } from './municipios.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';

@Controller('municipios')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermiso('municipios', 'crear')
  create(@Body() createMunicipioDto: CreateMunicipioDto) {
    return this.municipiosService.create(createMunicipioDto);
  }

  @Get()
  @RequirePermiso('municipios', 'ver')
  findAll() {
    return this.municipiosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('municipios', 'ver')
  findOne(@Param('id') id: string) {
    return this.municipiosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('municipios', 'actualizar')
  update(@Param('id') id: string, @Body() updateMunicipioDto: UpdateMunicipioDto) {
    return this.municipiosService.update(+id, updateMunicipioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermiso('municipios', 'eliminar')
  remove(@Param('id') id: string) {
    return this.municipiosService.remove(+id);
  }
}
