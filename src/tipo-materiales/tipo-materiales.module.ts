import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoMaterial } from './entities/tipo-materiale.entity';
import { TipoMaterialService } from './tipo-materiales.service';
import { TipoMaterialesController } from './tipo-materiales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoMaterial])],
  controllers: [TipoMaterialesController],
  providers: [TipoMaterialService],
  exports: [TypeOrmModule],
})
export class TipoMaterialesModule {}
