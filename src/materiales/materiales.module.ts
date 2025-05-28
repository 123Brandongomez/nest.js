import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { CategoriaElemento } from '../categoria-elementos/entities/categoria-elemento.entity';
import { TipoMaterial } from 'src/tipo-materiales/entities/tipo-materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
// Importar el módulo de imágenes común
import { ImagenesModule } from '../common/modules';
// Importar constantes
import { APP_CONSTANTS } from '../common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Material,
      CategoriaElemento,
      TipoMaterial,
      Sitio,
    ]),
     ImagenesModule.register(APP_CONSTANTS.IMAGES_PATHS.MATERIALES),
    
  ],
  controllers: [MaterialesController],
  providers: [MaterialesService],
})
export class MaterialesModule {}
