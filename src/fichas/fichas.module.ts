// src/fichas/fichas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichasService } from './fichas.service';
import { FichasController } from './fichas.controller';
import { Ficha } from './entities/ficha.entity'; // importa tu entidad
import { Programa } from 'src/programas/entities/programa.entity'; // si usas esta entidad en el servicio

@Module({
  imports: [
    TypeOrmModule.forFeature([Ficha, Programa]) // <-- esto es lo clave
  ],
  controllers: [FichasController],
  providers: [FichasService],
})
export class FichasModule {}
