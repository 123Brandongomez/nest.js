import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { ProgramasService } from './programas.service';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';

@Controller('programas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProgramasController {
  constructor(private readonly programasService: ProgramasService) {}

  @Post()
  @RequirePermiso('programas', 'crear')
  create(@Body() createProgramaDto: CreateProgramaDto) {
    return this.programasService.create(createProgramaDto);
  }

  @Get()
  @RequirePermiso('programas', 'ver')
  findAll() {
    return this.programasService.findAll();
  }

  @Get(':id')
  @RequirePermiso('programas', 'ver')
  findOne(@Param('id') id: string) {
    return this.programasService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('programas', 'actualizar')
  update(@Param('id') id: string, @Body() updateProgramaDto: UpdateProgramaDto) {
    return this.programasService.update(+id, updateProgramaDto);
  }

  @Delete(':id')
  @RequirePermiso('programas', 'eliminar')
  remove(@Param('id') id: string) {
    return this.programasService.remove(+id);
  }
}
