import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto
  ) {
    try {
      // Si se ha subido una imagen, guardar la ruta en el DTO
      if (file) {
        // La ruta debe ser accesible desde el navegador
        createUsuarioDto.imagen = `/public/img_usuarios/${file.filename}`;
        console.log('Imagen de usuario guardada en:', file.path);
      }
      
      // Crear el usuario con sus relaciones
      return await this.usuariosService.create(createUsuarioDto);
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario: ' + error.message);
    }
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
