import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';

/**
 * Filtro para manejar excepciones relacionadas con archivos
 */
@Catch(MulterError)
export class FileExceptionFilter implements ExceptionFilter {
  /**
   * Maneja las excepciones de Multer y las transforma en respuestas HTTP adecuadas
   * @param exception 
   * @param host 
   */
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.BAD_REQUEST;
    let message = 'Error al procesar el archivo';
    
    // Manejar diferentes tipos de errores de Multer
    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        message = 'El archivo excede el tamaño maximo permitido';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Se ha excedido el numero maximo de archivos permitidos';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = `Campo inesperado: ${exception.field}`;
        break;
      case 'LIMIT_FIELD_KEY':
        message = 'Nombre de campo demasiado largo';
        break;
      case 'LIMIT_FIELD_VALUE':
        message = 'Valor de campo demasiado largo';
        break;
      case 'LIMIT_FIELD_COUNT':
        message = 'Se ha excedido el numero maximo de campos permitidos';
        break;
      case 'LIMIT_PART_COUNT':
        message = 'Se ha excedido el numero maximo de partes permitidas';
        break;
    }
    
    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
