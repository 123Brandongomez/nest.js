import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoSitio } from './entities/tipo-sitio.entity';
import { TipoSitiosService } from './tipo-sitios.service';
import { TipoSitiosController } from './tipo-sitios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoSitio])],
  controllers: [TipoSitiosController],
  providers: [TipoSitiosService],
  exports: [TypeOrmModule],
})
export class TipoSitiosModule {}
