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
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    
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
