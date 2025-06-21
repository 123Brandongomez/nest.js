// sitios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sitio } from './entities/sitio.entity';
import { SitioService } from './sitios.service';
import { SitiosController } from './sitios.controller';
import { TipoSitiosModule } from '../tipo-sitios/tipo-sitios.module';  // Importa el módulo de TipoSitio
import { UsuariosModule } from '../usuarios/usuarios.module';  // Importa el módulo de Usuario

@Module({
  imports: [
    TypeOrmModule.forFeature([Sitio]),  // Repositorio de Sitio
    TipoSitiosModule,  // Asegúrate de importar TipoSitioModule
    UsuariosModule,  // Asegúrate de importar UsuarioModule
  ],
  controllers: [SitiosController],
  providers: [SitioService],
})
export class SitiosModule {}
