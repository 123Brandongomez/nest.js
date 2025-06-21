import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaElemento } from './entities/categoria-elemento.entity';
import { CategoriaElementoService } from './categoria-elementos.service';
import { CategoriaElementosController } from './categoria-elementos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaElemento])],
  controllers: [CategoriaElementosController],
  providers: [CategoriaElementoService],
  exports: [TypeOrmModule],
})
export class CategoriaElementosModule {}
