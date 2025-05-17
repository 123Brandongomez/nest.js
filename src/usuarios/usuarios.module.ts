import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { ImagenesModule } from 'src/imagenes/imagenes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]),
    ImagenesModule.register('./public/img_usuarios')
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [TypeOrmModule, UsuariosService],
})
export class UsuariosModule {}
