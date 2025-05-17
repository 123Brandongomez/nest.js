import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/materiale.entity';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { CategoriaElemento } from '../categoria-elementos/entities/categoria-elemento.entity';
import { TipoMaterial } from 'src/tipo-materiales/entities/tipo-materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { ImagenesModule } from 'src/imagenes/imagenes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Material,
      CategoriaElemento,
      TipoMaterial,
      Sitio,
    ]),
     ImagenesModule.register('./public/img'),
    
  ],
  controllers: [MaterialesController],
  providers: [MaterialesService],
})
export class MaterialesModule {}
