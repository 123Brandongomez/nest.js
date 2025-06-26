import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { SedesService } from './sedes.service';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Controller('sedes')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class SedesController {
  constructor(private readonly sedesService: SedesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermiso('sedes', 'crear')
  create(@Body() createSedeDto: CreateSedeDto) {
    return this.sedesService.create(createSedeDto);
  }

  @Get()
  @RequirePermiso('sedes', 'ver')
  findAll() {
    return this.sedesService.findAll();
  }

  @Get(':id')
  @RequirePermiso('sedes', 'ver')
  findOne(@Param('id') id: string) {
    return this.sedesService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('sedes', 'actualizar')
  update(@Param('id') id: string, @Body() updateSedeDto: UpdateSedeDto) {
    return this.sedesService.update(+id, updateSedeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermiso('sedes', 'eliminar')
  remove(@Param('id') id: string) {
    return this.sedesService.remove(+id);
  }
}
