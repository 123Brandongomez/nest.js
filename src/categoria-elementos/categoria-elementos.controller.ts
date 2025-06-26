import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { CategoriaElementoService } from './categoria-elementos.service';
import { CreateCategoriaElementoDto } from './dto/create-categoria-elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria-elemento.dto';

@Controller('categoria-elementos')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CategoriaElementosController {
  constructor(private readonly categoriaElementosService: CategoriaElementoService) {}

  @Post()
  @RequirePermiso('categoria-elementos', 'crear')
  create(@Body() createCategoriaElementoDto: CreateCategoriaElementoDto) {
    return this.categoriaElementosService.create(createCategoriaElementoDto);
  }

  @Get()
  @RequirePermiso('categoria-elementos', 'ver')
  findAll() {
    return this.categoriaElementosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('categoria-elementos', 'ver')
  findOne(@Param('id') id: string) {
    return this.categoriaElementosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('categoria-elementos', 'actualizar')
  update(@Param('id') id: string, @Body() updateCategoriaElementoDto: UpdateCategoriaElementoDto) {
    return this.categoriaElementosService.update(+id, updateCategoriaElementoDto);
  }

  @Delete(':id')
  @RequirePermiso('categoria-elementos', 'eliminar')
  remove(@Param('id') id: string) {
    return this.categoriaElementosService.remove(+id);
  }
}
