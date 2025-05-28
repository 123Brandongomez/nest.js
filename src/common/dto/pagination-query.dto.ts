import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para las consultas de paginación
 * Permite estandarizar los parámetros de paginación en las consultas
 */
export class PaginationQueryDto {
  /**
   * Número de página (por defecto: 1)
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  /**
   * Tamaño de página (por defecto: 10)
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
