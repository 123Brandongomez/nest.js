import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard para proteger rutas que requieren roles especu00edficos
 */
@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * Constructor del guard
   * @param reflector Reflector para acceder a los metadatos
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determina si el usuario tiene los roles necesarios para acceder a la ruta
   * @param context Contexto de ejecuciu00f3n
   * @returns true si el usuario tiene los roles necesarios, false en caso contrario
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos usando la constante ROLES_KEY
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar que el usuario esté autenticado
    if (!user) {
      throw new ForbiddenException('No está autenticado');
    }
    
    // Obtener el rol del usuario (puede estar en user.rol o user.rol_id dependiendo de la implementación)
    const userRole = user.rol || user.rol_id;
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.some(role => {
      // Si el rol del usuario es un objeto, comparar por id
      if (typeof userRole === 'object' && userRole !== null) {
        return userRole.nombre === role || userRole.id === role;
      }
      // Si es un string o número, comparar directamente
      return userRole === role;
    });
    
    if (!hasRole) {
      throw new ForbiddenException('No tiene permisos para acceder a este recurso');
    }
    
    return true;
  }
}
