import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/roles.enum';

/**
 * Clave para los metadatos de roles
 */
export const ROLES_KEY = 'roles';

/**
 * Clave para los metadatos de áreas
 */
export const AREAS_KEY = 'areas';

/**
 * Decorador para especificar los roles requeridos para acceder a una ruta
 * @param roles Roles requeridos
 * @returns Decorador
 */
export const Roles = (...roles: (Role | string)[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Decorador para especificar las áreas requeridas para acceder a una ruta
 * @param areas Áreas requeridas
 * @returns Decorador
 */
export const Areas = (...areas: string[]) => SetMetadata(AREAS_KEY, areas);

/**
 * Interfaz para definir los requisitos de acceso
 */
export interface AccessRequirements {
  roles?: (Role | string)[];
  areas?: string[];
}

/**
 * Decorador para especificar los requisitos de acceso a una ruta
 * @param requirements Requisitos de acceso (roles y/o áreas)
 * @returns Decorador
 */
export const RequireAccess = (requirements: AccessRequirements) => {
  return (target: any, key?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    if (requirements.roles && requirements.roles.length > 0) {
      if (descriptor) {
        // Si es un método (tiene descriptor)
        Roles(...requirements.roles)(target, key!, descriptor);
      } else {
        // Si es una clase (no tiene descriptor)
        Roles(...requirements.roles)(target);
      }
    }
    
    if (requirements.areas && requirements.areas.length > 0) {
      if (descriptor) {
        // Si es un método (tiene descriptor)
        Areas(...requirements.areas)(target, key!, descriptor);
      } else {
        // Si es una clase (no tiene descriptor)
        Areas(...requirements.areas)(target);
      }
    }
    
    return descriptor || target;
  };
};
