import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Rol } from 'src/roles/entities/role.entity';
// Importar el módulo de imágenes común
import { ImagenesModule } from '../common/modules';
// Importar constantes
import { APP_CONSTANTS } from '../common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]),
    ImagenesModule.register(APP_CONSTANTS.IMAGES_PATHS.USUARIOS)
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
