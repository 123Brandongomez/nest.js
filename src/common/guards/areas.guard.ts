import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AREAS_KEY } from '../decorators/roles.decorator';

/**
 * Guard para proteger rutas que requieren áreas específicas
 */
@Injectable()
export class AreasGuard implements CanActivate {
  /**
   * Constructor del guard
   * @param reflector Reflector para acceder a los metadatos
   */
  constructor(private reflector: Reflector) {}

  /**
   * Determina si el usuario tiene las áreas necesarias para acceder a la ruta
   * @param context Contexto de ejecución
   * @returns true si el usuario tiene las áreas necesarias, false en caso contrario
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener las áreas requeridas usando la constante AREAS_KEY
    const requiredAreas = this.reflector.getAllAndOverride<string[]>(AREAS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay áreas requeridas, permitir acceso
    if (!requiredAreas || requiredAreas.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Verificar que el usuario esté autenticado
    if (!user) {
      throw new ForbiddenException('No está autenticado');
    }
    
    // Obtener el área del usuario (puede estar en user.area o user.area_id dependiendo de la implementación)
    const userArea = user.area || user.area_id;
    
    // Si el usuario no tiene área asignada, denegar acceso
    if (!userArea) {
      throw new ForbiddenException('No tiene un área asignada');
    }
    
    // Verificar si el usuario tiene alguna de las áreas requeridas
    const hasArea = requiredAreas.some(area => {
      // Si el área del usuario es un objeto, comparar por id o nombre
      if (typeof userArea === 'object' && userArea !== null) {
        return userArea.nombre === area || userArea.id === area;
      }
      // Si es un string o número, comparar directamente
      return userArea === area;
    });
    
    if (!hasArea) {
      throw new ForbiddenException('No tiene permisos para acceder a este recurso');
    }
    
    return true;
  }
}
