import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessControlGuard } from '../guards/access-control.guard';
import { RequireAccess } from './roles.decorator';
import { Role } from '../enums/roles.enum';

/**
 * Decorador para proteger rutas que requieran autenticación
 * @param roles 
 * @param areas 
 * @returns 
 */
export function Auth(...roles: (Role | string)[]) {
  // Si se especifican roles, aplicar el decorador de roles y el guard de control de acceso
  if (roles.length > 0) {
    return applyDecorators(
      UseGuards(JwtAuthGuard, AccessControlGuard),
      RequireAccess({ roles })
    );
  }
  
  // Si no se especifican roles, solo aplicar el guard de JWT
  return applyDecorators(
    UseGuards(JwtAuthGuard)
  );
}

/**
 * Decorador para proteger rutas que requieran autenticación y permisos específicos
 * @param roles 
 * @param areas 
 * @returns 
 */
export function AuthWithAreas(roles: (Role | string)[] = [], areas: string[] = []) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, AccessControlGuard),
    RequireAccess({ roles, areas })
  );
}
