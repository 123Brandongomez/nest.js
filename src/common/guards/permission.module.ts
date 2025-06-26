import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from './permission.guard';
import { Permiso } from '../../permisos/entities/permiso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';
import { Modulo } from '../../modulos/entities/modulo.entity';

/**
 * Módulo global para la gestión de permisos
 * Este módulo proporciona el PermissionGuard y los repositorios necesarios
 * para verificar los permisos de los usuarios en toda la aplicación
 */
@Global() // Hacemos el módulo global para que esté disponible en toda la aplicación
@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso, Usuario, Rol, Modulo])
  ],
  providers: [PermissionGuard],
  exports: [PermissionGuard, TypeOrmModule] // Exportamos también TypeOrmModule para que los repositorios estén disponibles
})
export class PermissionModule {}
