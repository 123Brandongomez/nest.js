import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../../permisos/entities/permiso.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Permiso)
    private permisoRepository: Repository<Permiso>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los metadatos del decorador
    const modulo = this.reflector.get<string>('modulo', context.getHandler());
    const accion = this.reflector.get<string>('accion', context.getHandler());
    
    console.log(`PermissionGuard - Verificando acceso para módulo: ${modulo}, acción: ${accion}`);
    
    // Si no hay requisitos de permiso específicos, verificamos si la ruta está protegida de otra manera
    if (!modulo || !accion) {
      console.log('PermissionGuard - No hay requisitos de permiso específicos, permitiendo acceso');
      // Aquí podríamos verificar otros tipos de protección
      // Por ahora, solo permitimos acceso si no hay requisitos de permiso
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const usuario = request.user;

    if (!usuario) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Buscar el usuario completo con su rol
    const usuarioCompleto = await this.usuarioRepository.findOne({
      where: { id_usuario: usuario.id_usuario },
      relations: ['rol'],
    });

    console.log('Usuario encontrado:', {
      id: usuarioCompleto?.id_usuario,
      email: usuarioCompleto?.email,
      rol: usuarioCompleto?.rol?.nombre_rol,
      rol_id: usuarioCompleto?.rol?.id_rol
    });

    if (!usuarioCompleto || !usuarioCompleto.rol) {
      throw new UnauthorizedException('Usuario sin rol asignado');
    }

    // Verificar si es super administrador o administrador
    console.log(`Verificando rol: '${usuarioCompleto.rol.nombre_rol}' contra 'Super Administrador'`);
    if (usuarioCompleto.rol.nombre_rol.toLowerCase() === 'super administrador') {
      console.log('Es super administrador, acceso permitido');
      return true; // El super administrador tiene acceso a todo
    }
    
    // Si es un administrador y está intentando acceder a la gestión de permisos, permitirlo
    console.log(`Verificando si es administrador y módulo es permisos: ${usuarioCompleto.rol.nombre_rol === 'Administrador'} && ${modulo === 'permisos'}`);
    if (usuarioCompleto.rol.nombre_rol === 'Administrador' && modulo === 'permisos') {
      console.log('Es administrador accediendo a gestión de permisos, acceso permitido');
      return true; // El administrador puede gestionar permisos
    }

    console.log(`Verificando permisos para rol: ${usuarioCompleto.rol.nombre_rol}, módulo: ${modulo}, acción: ${accion}`);

    // Buscar el permiso para el rol y módulo específico
    const permisos = await this.permisoRepository.find({
      where: {
        rol_id: { id_rol: usuarioCompleto.rol.id_rol },
      },
      relations: ['modulo_id'],
    });
    
    console.log(`Permisos encontrados: ${permisos.length}`);
    
    // Verificar si hay permisos para este rol
    if (permisos.length === 0) {
      console.log('No se encontraron permisos para este rol');
      return false; // No tiene ningún permiso asignado
    }
    
    // Filtrar los permisos por el módulo correcto
    console.log('Todos los permisos del usuario:', permisos.map(p => ({
      id_permiso: p.id_permiso,
      modulo: p.modulo_id?.rutas || 'sin módulo',
      puede_ver: p.puede_ver,
      puede_crear: p.puede_crear,
      puede_actualizar: p.puede_actualizar,
      puede_eliminar: p.puede_eliminar,
      estado: p.estado
    })));
    
    const permisosModulo = permisos.filter(p => {
      if (!p.modulo_id) {
        console.log('Permiso sin módulo asociado');
        return false;
      }
      
      // Comparación más flexible: normalizar ambos valores a minúsculas y sin espacios
      const rutaNormalizada = p.modulo_id.rutas.toLowerCase().trim();
      const moduloNormalizado = modulo.toLowerCase().trim();
      
      // Verificar coincidencia exacta o si la ruta contiene el módulo
      const coincideExacto = rutaNormalizada === moduloNormalizado;
      const contiene = rutaNormalizada.includes(moduloNormalizado);
      
      console.log(`Módulo DB: '${p.modulo_id.rutas}' (${rutaNormalizada}) vs Requerido: '${modulo}' (${moduloNormalizado})`);
      console.log(`Coincidencia exacta: ${coincideExacto}, Contiene: ${contiene}`);
      
      return coincideExacto || contiene;
    });
    
    if (permisosModulo.length === 0) {
      console.log(`No tiene permisos para el módulo: ${modulo}`);
      return false; // No tiene permisos para este módulo
    }

    // Verificar la acción específica en todos los permisos del módulo
    for (const permiso of permisosModulo) {
      console.log(`Verificando permiso: ${JSON.stringify({
        puede_ver: permiso.puede_ver,
        puede_crear: permiso.puede_crear,
        puede_actualizar: permiso.puede_actualizar,
        estado: permiso.estado
      })}`);
      
      // Verificar si el permiso está activo
      if (permiso.estado !== true) {
        console.log('El permiso no está activo');
        continue; // Si el permiso no está activo, ignorarlo
      }
      
      switch (accion) {
        case 'ver':
          if (permiso.puede_ver === true) {
            console.log('Tiene permiso para ver');
            return true;
          }
          break;
        case 'crear':
          if (permiso.puede_crear === true) {
            console.log('Tiene permiso para crear');
            return true;
          }
          break;
        case 'actualizar':
          if (permiso.puede_actualizar === true) {
            console.log('Tiene permiso para actualizar');
            return true;
          }
          break;
        case 'eliminar':
          if (permiso.puede_eliminar === true) {
            console.log('Tiene permiso para eliminar');
            return true;
          }
          break;
      }
    }
    
    console.log('No tiene el permiso específico para la acción solicitada');
    return false; // No tiene el permiso específico para la acción
  }
}
