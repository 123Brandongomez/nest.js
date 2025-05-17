import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Para manejar archivos
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MaterialesService } from './materiales.service';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';

@Controller('materiales')
export class MaterialesController {
  constructor(private readonly materialesService: MaterialesService) {}

 @Post()
@UseInterceptors(FileInterceptor('imagen', {
  storage: diskStorage({
    destination: './public/img',
    filename: (req, file, callback) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
      callback(null, uniqueName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new BadRequestException('Solo se permiten archivos de imagen'), false);
    }
    callback(null, true);
  },
}))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() createMaterialeDto: CreateMaterialeDto,
) {
  try {
    // Si se ha subido una imagen, guardar la ruta en el DTO
    if (file) {
      // La ruta debe ser accesible desde el navegador
      createMaterialeDto.imagen = `/public/img/${file.filename}`;
      console.log('Imagen guardada en:', file.path);
    }
    
    // Crear el material con sus relaciones
    return await this.materialesService.create(createMaterialeDto);
  } catch (error) {
    throw new BadRequestException('Error al crear el material: ' + error.message);
  }
}

  @Get()
  findAll() {
    return this.materialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materialesService.findOne(+id);
  }

@Put(':id')
update(@Param('id') id: string, @Body() updateMaterialeDto: UpdateMaterialeDto) {
  return this.materialesService.update(+id, updateMaterialeDto);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materialesService.remove(+id);
  }
}
