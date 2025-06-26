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

import { FileResponseInterceptor } from '../common/interceptors';
import { FileValidationPipe } from '../common/pipes';
import { ImagenesService } from '../common/services';
import { APP_CONSTANTS } from '../common/constants';
import { JwtAuthGuard } from '../common/guards';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';

// ✅ Importar decorador personalizado
import { UploadFile } from '../common/decorators/upload-file.decorator';

@Controller('materiales')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class MaterialesController {
  constructor(
    private readonly materialesService: MaterialesService,
    private readonly imagenesService: ImagenesService
  ) {}

  @Post()
  @RequirePermiso('materiales', 'crear')
  @UploadFile('imagen')
  @UseInterceptors(FileResponseInterceptor)
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

      return await this.materialesService.create(createMaterialeDto);
    } catch (error) {
      throw new BadRequestException('Error al crear el material: ' + error.message);
    }
  }

  @Get()
  @RequirePermiso('materiales', 'ver')
  findAll() {
    return this.materialesService.findAll();
  }

  @Get(':id')
  @RequirePermiso('materiales', 'ver')
  findOne(@Param('id') id: string) {
    return this.materialesService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('materiales', 'actualizar')
  update(@Param('id') id: string, @Body() updateMaterialeDto: UpdateMaterialeDto) {
    return this.materialesService.update(+id, updateMaterialeDto);
  }

  @Delete(':id')
  @RequirePermiso('materiales', 'actualizar')
  remove(@Param('id') id: string) {
    return this.materialesService.remove(+id);
  }
}
