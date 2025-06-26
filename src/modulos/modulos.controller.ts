import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Controller('modulos')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  @RequirePermiso('modulos', 'crear')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createModuloDto: CreateModuloDto
  ) {
    try {
      // Si se ha subido una imagen, guardar la ruta en el DTO
      if (file) {
        // La ruta debe ser accesible desde el navegador
        createModuloDto.imagen = `/public/img_modulos/${file.filename}`;
        console.log('Imagen de módulo guardada en:', file.path);
      }
      
      // Crear el módulo con sus relaciones
      return await this.modulosService.create(createModuloDto);
    } catch (error) {
      throw new BadRequestException('Error al crear el módulo: ' + error.message);
    }
  }

  @Get()
  @RequirePermiso('modulos', 'ver')
  findAll() {
    return this.modulosService.findAll();
  }

  @Get(':id')
  @RequirePermiso('modulos', 'ver')
  findOne(@Param('id') id: string) {
    return this.modulosService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('modulos', 'actualizar')
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.modulosService.update(+id, updateModuloDto);
  }

  @Delete(':id')
  @RequirePermiso('modulos', 'eliminar')
  remove(@Param('id') id: string) {
    return this.modulosService.remove(+id);
  }
}
