import { PaginationDto } from '../dto/pagination.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

/**
 * Interfaz que define los mu00e9todos bu00e1sicos para un servicio CRUD
 * @template T Tipo de entidad
 * @template CreateDto Tipo de DTO para crear
 * @template UpdateDto Tipo de DTO para actualizar
 */
export interface ICrudService<T, CreateDto, UpdateDto> {
  /**
   * Crea una nueva entidad
   * @param createDto DTO con los datos para crear
   * @returns Entidad creada
   */
  create(createDto: CreateDto): Promise<T>;

  /**
   * Obtiene todas las entidades con paginaciu00f3n
   * @param paginationQuery Paru00e1metros de paginaciu00f3n
   * @param relations Relaciones a cargar (opcional)
   * @returns Respuesta paginada
   */
  findAll(paginationQuery?: PaginationQueryDto, relations?: string[]): Promise<PaginationDto<T>>;

  /**
   * Obtiene una entidad por su ID
   * @param id ID de la entidad
   * @param relations Relaciones a cargar (opcional)
   * @returns Entidad encontrada
   */
  findOne(id: number | string, relations?: string[]): Promise<T>;

  /**
   * Actualiza una entidad por su ID
   * @param id ID de la entidad
   * @param updateDto DTO con los datos para actualizar
   * @returns Entidad actualizada
   */
  update(id: number | string, updateDto: UpdateDto): Promise<T>;

  /**
   * Elimina una entidad por su ID
   * @param id ID de la entidad
   * @returns true si la entidad fue eliminada
   */
  remove(id: number | string): Promise<boolean>;
}
