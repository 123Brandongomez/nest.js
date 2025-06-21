import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { FileResponseInterceptor } from '../common/interceptors';
import { FileValidationPipe } from '../common/pipes';
import { ImagenesService } from '../common/services';
import { APP_CONSTANTS } from '../common/constants';
import { JwtAuthGuard } from '../common/guards';
import { applyDecorators } from '@nestjs/common';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly imagenesService: ImagenesService
  ) {}

  @Post()
  @UploadFile('imagen')
  @UseInterceptors(FileResponseInterceptor)
  async create(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto
  ) {
    try {
      if (file) {
        const imageUrl = this.imagenesService.getImageUrl(
          file.filename,
          APP_CONSTANTS.IMAGES_BASE_URLS.USUARIOS
        );
        createUsuarioDto.imagen = imageUrl;
      }

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

// ✅ Decorador personalizado para subir archivos
function UploadFile(fieldName: string) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName))
  );
}
