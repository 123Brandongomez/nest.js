import { Controller, Get, Post, Body, Put, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

// Importar componentes comunes
import { FileResponseInterceptor } from '../common/interceptors';
import { UploadFile, Auth } from '../common/decorators';
import { RequireAccess, Roles, Areas } from '../common/decorators/roles.decorator';
import { FileValidationPipe } from '../common/pipes';
import { ImagenesService } from '../common/services';
import { APP_CONSTANTS } from '../common/constants';
import { AccessControlGuard, JwtAuthGuard } from '../common/guards';
import { Role } from '../common/enums/roles.enum';
import { Area } from '../common/enums/areas.enum';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, AccessControlGuard)
@RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR], areas: [Area.ADMINISTRACION, Area.RECURSOS_HUMANOS] })
export class UsuariosController {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly imagenesService: ImagenesService
  ) {}

  @Post()
  @UploadFile('imagen')
  @UseInterceptors(FileResponseInterceptor)
  @RequireAccess({ roles: [Role.ADMIN], areas: [Area.ADMINISTRACION] }) // Solo administradores del u00e1rea de administraciu00f3n pueden crear usuarios
  async create(
    @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
    @Body() createUsuarioDto: CreateUsuarioDto
  ) {
    try {
      // Si se ha subido una imagen, guardar la ruta en el DTO
      if (file) {
        // Usar el servicio de imágenes para obtener la URL
        const imageUrl = this.imagenesService.getImageUrl(
          file.filename, 
          APP_CONSTANTS.IMAGES_BASE_URLS.USUARIOS
        );
        createUsuarioDto.imagen = imageUrl;

      }
      
      // Crear el usuario con sus relaciones
      return await this.usuariosService.create(createUsuarioDto);
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario: ' + error.message);
    }
  }

  @Get()
  @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR], areas: [Area.ADMINISTRACION, Area.RECURSOS_HUMANOS] }) // Administradores y supervisores pueden ver todos los usuarios
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR], areas: [Area.ADMINISTRACION, Area.RECURSOS_HUMANOS] }) // Más roles pueden ver un usuario específico
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Put(':id')
  @RequireAccess({ roles: [Role.ADMIN], areas: [Area.ADMINISTRACION, Area.RECURSOS_HUMANOS] }) // Solo administradores pueden actualizar usuarios
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @RequireAccess({ roles: [Role.ADMIN], areas: [Area.ADMINISTRACION] }) // Solo administradores del área de administración pueden eliminar usuarios
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
