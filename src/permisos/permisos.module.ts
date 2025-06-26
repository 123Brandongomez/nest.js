import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermisoService } from './permisos.service';
import { PermisosController } from './permisos.controller';
import { Permiso } from './entities/permiso.entity';
import { Modulo } from '../modulos/entities/modulo.entity'; // Asegúrate de que este path sea correcto
import { Rol } from 'src/roles/entities/role.entity';       // Igual aquí
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso, Modulo, Rol, Usuario]) // 👈 Importamos los cuatro repositorios
  ],
  controllers: [PermisosController],
  providers: [PermisoService],
  exports: [TypeOrmModule],
})
export class PermisosModule {}
