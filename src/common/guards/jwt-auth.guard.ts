import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * Guard para proteger rutas que requieren autenticación JWT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);
  
  // Lista de rutas públicas que no requieren autenticación
  private readonly publicRoutes = [
    '/validacion',  // Ruta de login
    '/registrar',   // Ruta de registro
  ];

  /**
   * Maneja la activación del guard
   * @param context Contexto de ejecución
   * @returns Resultado de la activación
   */
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { url } = request;
    
    // Verificar si la ruta es pública
    if (this.isPublicRoute(url)) {
      this.logger.log(`Ruta pública detectada: ${url} - Permitiendo acceso sin autenticación`);
      return true;
    }
    
    this.logger.log(`Verificando autenticación para ruta: ${url}`);
    return super.canActivate(context);
  }
  
  /**
   * Verifica si una ruta es pública
   * @param path Ruta a verificar
   * @returns true si la ruta es pública
   */
  private isPublicRoute(url: string): boolean {
    return this.publicRoutes.some(route => url === route || url.startsWith(route));
  }

  /**
   * Maneja los errores de autenticaciu00f3n
   * @param error Error capturado
   */
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('No autorizado');
    }
    return user;
  }
}
