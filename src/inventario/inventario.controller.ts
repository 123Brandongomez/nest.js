import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Controller('inventario')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @RequirePermiso('inventario', 'crear')
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  @RequirePermiso('inventario', 'ver')
  findAll() {
    return this.inventarioService.findAll();
  }

  @Get(':id')
  @RequirePermiso('inventario', 'ver')
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermiso('inventario', 'actualizar')
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @Delete(':id')
  @RequirePermiso('inventario', 'eliminar')
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }
}
