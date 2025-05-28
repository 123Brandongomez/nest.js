import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

/**
 * Pipe para transformar y validar los paru00e1metros de paginaciu00f3n en las consultas HTTP
 */
@Injectable()
export class PaginationPipe implements PipeTransform<any, PaginationQueryDto> {
  /**
   * Transforma los paru00e1metros de la consulta en un objeto PaginationQueryDto
   * @param value Valor a transformar
   * @param metadata Metadatos del argumento
   * @returns Objeto PaginationQueryDto
   */
  transform(value: any, metadata: ArgumentMetadata): PaginationQueryDto {
    // Si no hay valor, devolver valores por defecto
    if (!value) {
      return new PaginationQueryDto();
    }

    // Crear un nuevo objeto PaginationQueryDto
    const paginationQuery = new PaginationQueryDto();
    
    // Convertir page a nu00famero si existe
    if (value.page) {
      paginationQuery.page = parseInt(value.page, 10);
      // Asegurarse de que page sea al menos 1
      if (paginationQuery.page < 1) {
        paginationQuery.page = 1;
      }
    }
    
    // Convertir limit a nu00famero si existe
    if (value.limit) {
      paginationQuery.limit = parseInt(value.limit, 10);
      // Asegurarse de que limit sea al menos 1
      if (paginationQuery.limit < 1) {
        paginationQuery.limit = 1;
      }
      // Limitar el tamau00f1o mu00e1ximo de pu00e1gina a 100 para evitar sobrecarga
      if (paginationQuery.limit > 100) {
        paginationQuery.limit = 100;
      }
    }
    
    return paginationQuery;
  }
}
