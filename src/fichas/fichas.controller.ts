import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { FichasService } from './fichas.service';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';

@Controller('fichas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FichasController {
  constructor(private readonly fichasService: FichasService) {}

  @Post()
  @RequirePermiso('fichas', 'crear')
  create(@Body() createFichaDto: CreateFichaDto) {
    return this.fichasService.create(createFichaDto);
  }

  @Get()
  @RequirePermiso('fichas', 'ver')
  findAll() {
    return this.fichasService.findAll();
  }

  @Get(':id')
  @RequirePermiso('fichas', 'ver')
  findOne(@Param('id') id: string) {
    return this.fichasService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('fichas', 'actualizar')
  update(@Param('id') id: string, @Body() updateFichaDto: UpdateFichaDto) {
    return this.fichasService.update(+id, updateFichaDto);
  }

  @Delete(':id')
  @RequirePermiso('fichas', 'eliminar')
  remove(@Param('id') id: string) {
    return this.fichasService.remove(+id);
  }
}
