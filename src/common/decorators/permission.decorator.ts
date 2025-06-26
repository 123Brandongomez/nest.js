import { SetMetadata } from '@nestjs/common';

export const RequireModulo = (modulo: string) => SetMetadata('modulo', modulo);
export const RequireAccion = (accion: string) => SetMetadata('accion', accion);
export const RequirePermiso = (modulo: string, accion: string) => {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata('modulo', modulo)(target, key, descriptor);
    SetMetadata('accion', accion)(target, key, descriptor);
    return descriptor;
  };
};
