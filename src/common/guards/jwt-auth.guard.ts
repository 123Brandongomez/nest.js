import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para proteger rutas que requieren autenticaciu00f3n JWT
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Maneja la activaciu00f3n del guard
   * @param context Contexto de ejecuciu00f3n
   * @returns Resultado de la activaciu00f3n
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
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
