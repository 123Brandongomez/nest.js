import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { CentrosService } from './centros.service';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';

@Controller('centros')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CentrosController {
  constructor(private readonly centrosService: CentrosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermiso('centros', 'crear')
  create(@Body() createCentroDto: CreateCentroDto) {
    return this.centrosService.create(createCentroDto);
  }

  @Get()
  @RequirePermiso('centros', 'ver')
  findAll() {
    return this.centrosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('centros', 'ver')
  findOne(@Param('id') id: string) {
    return this.centrosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('centros', 'actualizar')
  update(@Param('id') id: string, @Body() updateCentroDto: UpdateCentroDto) {
    return this.centrosService.update(+id, updateCentroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermiso('centros', 'eliminar')
  remove(@Param('id') id: string) {
    return this.centrosService.remove(+id);
  }
}
