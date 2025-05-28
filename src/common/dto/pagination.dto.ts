/**
 * DTO para la respuesta paginada
 */
export class PaginationDto<T> {
  /**
   * Elementos de la página actual
   */
  items: T[];

  /**
   * Número total de elementos
   */
  total: number;

  /**
   * Página actual
   */
  page: number;

  /**
   * Tamaño de página
   */
  limit: number;

  /**
   * Número total de páginas
   */
  totalPages: number;

  /**
   * Indica si hay una página anterior
   */
  hasPrevPage: boolean;

  /**
   * Indica si hay una página siguiente
   */
  hasNextPage: boolean;

  /**
   * Número de la página anterior (null si no existe)
   */
  prevPage: number | null;

  /**
   * Número de la página siguiente (null si no existe)
   */
  nextPage: number | null;
}
