import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImagenesService } from '../services/imagenes.service';

/**
 * Interceptor para transformar respuestas de archivos
 */
@Injectable()
export class FileResponseInterceptor implements NestInterceptor {
  constructor(private readonly imagenesService: ImagenesService) {}

  /**
   * Intercepta la respuesta y transforma los archivos a un formato estandarizado
   * @param context Contexto de ejecuciu00f3n
   * @param next Manejador de llamada
   * @returns Observable con la respuesta transformada
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Verificar si hay un archivo en la solicitud
        const request = context.switchToHttp().getRequest();
        const file = request.file;
        const files = request.files;
        
        // Si hay un archivo, transformarlo
        if (file) {
          const baseUrl = request.baseUrl || '/img';
          return this.imagenesService.mapFileToResponse(file, baseUrl);
        }
        
        // Si hay mu00faltiples archivos, transformarlos
        if (files && Array.isArray(files)) {
          const baseUrl = request.baseUrl || '/img';
          return this.imagenesService.mapFilesToResponse(files, baseUrl);
        }
        
        // Si no hay archivos, devolver los datos originales
        return data;
      }),
    );
  }
}
