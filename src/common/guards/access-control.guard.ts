import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, AREAS_KEY } from '../decorators/roles.decorator';

/**
 * Guard para proteger rutas que requieren roles y/o u00e1reas especu00edficas
 */
@Injectable()
export class AccessControlGuard implements CanActivate {
  /**
   * Constructor del guard
   * @param reflector Reflector para acceder a los metadatos
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determina si el usuario tiene los permisos necesarios para acceder a la ruta
   * @param context Contexto de ejecuciu00f3n
   * @returns true si el usuario tiene los permisos necesarios, false en caso contrario
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Obtener las u00e1reas requeridas
    const requiredAreas = this.reflector.getAllAndOverride<string[]>(AREAS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles ni u00e1reas requeridas, permitir acceso
    if ((!requiredRoles || requiredRoles.length === 0) && (!requiredAreas || requiredAreas.length === 0)) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar que el usuario estu00e9 autenticado
    if (!user) {
      throw new ForbiddenException('No estu00e1 autenticado');
    }
    
    // Verificar roles si son requeridos
    if (requiredRoles && requiredRoles.length > 0) {
      const userRole = user.rol || user.rol_id;
      
      if (!userRole) {
        throw new ForbiddenException('No tiene un rol asignado');
      }
      
      const hasRole = requiredRoles.some(role => {
        if (typeof userRole === 'object' && userRole !== null) {
          return userRole.nombre === role || userRole.id === role;
        }
        return userRole === role;
      });
      
      if (!hasRole) {
        throw new ForbiddenException('No tiene el rol necesario para acceder a este recurso');
      }
    }
    
    // Verificar u00e1reas si son requeridas
    if (requiredAreas && requiredAreas.length > 0) {
      const userArea = user.area || user.area_id;
      
      if (!userArea) {
        throw new ForbiddenException('No tiene un u00e1rea asignada');
      }
      
      const hasArea = requiredAreas.some(area => {
        if (typeof userArea === 'object' && userArea !== null) {
          return userArea.nombre === area || userArea.id === area;
        }
        return userArea === area;
      });
      
      if (!hasArea) {
        throw new ForbiddenException('No tiene acceso al u00e1rea requerida para este recurso');
      }
    }
    
    return true;
  }
}
