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
  ParseIntPipe,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';

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

@Controller('materiales')
@UseGuards(JwtAuthGuard, AccessControlGuard)
@RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR], areas: [Area.ALMACEN, Area.PRODUCCION] })
export class MaterialesController {
  constructor(
    private readonly materialesService: MaterialesService,
    private readonly imagenesService: ImagenesService
  ) {}

 @Post()
 @UploadFile('imagen')
 @UseInterceptors(FileResponseInterceptor)
 @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR], areas: [Area.ALMACEN] }) // Solo admin y supervisor de almacén pueden crear materiales
 async create(
  @UploadedFile(new FileValidationPipe()) file: Express.Multer.File,
  @Body() createMaterialeDto: CreateMaterialeDto,
) {
  try {
    if (file) {
      const imageUrl = this.imagenesService.getImageUrl(
        file.filename, 
        APP_CONSTANTS.IMAGES_BASE_URLS.MATERIALES
      );
      createMaterialeDto.imagen = imageUrl;

    }
    
    // Crear el material con sus relaciones
    return await this.materialesService.create(createMaterialeDto);
  } catch (error) {
    throw new BadRequestException('Error al crear el material: ' + error.message);
  }
}

  @Get()
  @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR], areas: [Area.ALMACEN, Area.PRODUCCION] }) // Todos los roles pueden ver la lista de materiales
  findAll() {
    return this.materialesService.findAll();
  }

  @Get(':id')
  @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR, Role.OPERADOR], areas: [Area.ALMACEN, Area.PRODUCCION] }) // Todos los roles pueden ver un material específico
  findOne(@Param('id') id: string) {
    return this.materialesService.findOne(+id);
  }

  @Put(':id')
  @RequireAccess({ roles: [Role.ADMIN, Role.SUPERVISOR], areas: [Area.ALMACEN] }) // Solo admin y supervisor de almacén pueden actualizar materiales
  update(@Param('id') id: string, @Body() updateMaterialeDto: UpdateMaterialeDto) {
    return this.materialesService.update(+id, updateMaterialeDto);
  }

  @Delete(':id')
  @RequireAccess({ roles: [Role.ADMIN], areas: [Area.ALMACEN] }) // Solo admin de almacén puede eliminar materiales
  remove(@Param('id') id: string) {
    return this.materialesService.remove(+id);
  }
}
