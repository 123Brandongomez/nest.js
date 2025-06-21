import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interfaz para la respuesta estandarizada
 */
export interface Response<T> {
  /**
   * Datos de la respuesta
   */
  data: T;
  
  /**
   * Código de estado HTTP
   */
  statusCode: number;
  
  /**
   * Mensaje descriptivo
   */
  message: string;
  
  /**
   * Timestamp de la respuesta
   */
  timestamp: string;
}

/**
 * Interceptor para transformar las respuestas HTTP
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * Intercepta la respuesta y la transforma a un formato estandarizado
   * @param context Contexto de ejecución
   * @param next Manejador de llamada
   * @returns Observable con la respuesta transformada
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T> | any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const path = request.path;
    
    // Excluir rutas de autenticación de la transformación
    const authPaths = [
      '/validacion',  // Ruta de login
      '/registrar'    // Ruta de registro
    ];
    
    // Si es una ruta de autenticación, devolver la respuesta sin transformar
    if (authPaths.some(authPath => path.endsWith(authPath))) {
      return next.handle();
    }
    
    // Para otras rutas, aplicar la transformación estándar
    return next.handle().pipe(
      map(data => ({
        data,
        statusCode,
        message: 'Operación exitosa',
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
