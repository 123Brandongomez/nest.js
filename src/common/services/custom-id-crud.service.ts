import { Repository, ObjectLiteral, FindOptionsWhere, FindManyOptions } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { EntityWithCustomId } from '../interfaces/entity-with-custom-id.interface';
import { ICrudService } from '../interfaces/crud-service.interface';

/**
 * Servicio base para operaciones CRUD con entidades que tienen ID personalizado
 * @template T Tipo de entidad
 * @template CreateDto Tipo de DTO para crear
 * @template UpdateDto Tipo de DTO para actualizar
 */
export abstract class CustomIdCrudService<T extends ObjectLiteral & EntityWithCustomId, CreateDto, UpdateDto> implements ICrudService<T, CreateDto, UpdateDto> {
  /**
   * Constructor del servicio base
   * @param repository Repositorio de la entidad
   * @param idField Nombre del campo ID en la entidad (ej: 'id_usuario', 'id_rol', etc.)
   */
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly idField: string
  ) {}

  /**
   * Crea una nueva entidad
   * @param createDto DTO con los datos para crear
   * @returns Entidad creada
   */
  async create(createDto: CreateDto): Promise<T> {
    const entity = this.repository.create(createDto as any);
    const savedEntity = await this.repository.save(entity);
    return savedEntity as unknown as T;
  }

  /**
   * Obtiene todas las entidades con paginación
   * @param paginationQuery Parámetros de paginación (opcional)
   * @param relations Relaciones a cargar (opcional)
   * @returns Respuesta paginada
   */
  async findAll(paginationQuery?: PaginationQueryDto, relations: string[] = []): Promise<PaginationDto<T>> {
    // Valores por defecto si no se proporciona paginationQuery
    const page = paginationQuery?.page || 1;
    const limit = paginationQuery?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Opciones de búsqueda
    const options: FindManyOptions<T> = {
      skip,
      take: limit,
      relations
    };
    
    // Ejecutar la consulta
    const [items, total] = await this.repository.findAndCount(options);

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(total / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasPrevPage,
      hasNextPage,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    };
  }

  /**
   * Obtiene una entidad por su ID
   * @param id ID de la entidad
   * @param relations Relaciones a cargar (opcional)
   * @returns Entidad encontrada
   * @throws NotFoundException si la entidad no existe
   */
  async findOne(id: number | string, relations: string[] = []): Promise<T> {
    const where = { [this.idField]: id } as unknown as FindOptionsWhere<T>;
    const entity = await this.repository.findOne({ where, relations });
    if (!entity) {
      throw new NotFoundException(`Entidad con ${this.idField} ${id} no encontrada`);
    }
    return entity;
  }

  /**
   * Actualiza una entidad por su ID
   * @param id ID de la entidad
   * @param updateDto DTO con los datos para actualizar
   * @returns Entidad actualizada
   * @throws NotFoundException si la entidad no existe
   */
  async update(id: number | string, updateDto: UpdateDto): Promise<T> {
    const entity = await this.findOne(id);
    const updatedEntity = { ...entity, ...updateDto as any };
    return await this.repository.save(updatedEntity);
  }

  /**
   * Elimina una entidad por su ID
   * @param id ID de la entidad
   * @returns true si la entidad fue eliminada
   * @throws NotFoundException si la entidad no existe
   */
  async remove(id: number | string): Promise<boolean> {
    const entity = await this.findOne(id);
    await this.repository.remove(entity);
    return true;
  }

  /**
   * Desactiva una entidad por su ID (eliminación lógica)
   * @param id ID de la entidad
   * @returns Entidad desactivada
   * @throws NotFoundException si la entidad no existe
   */
  async softDelete(id: number | string): Promise<T> {
    const entity = await this.findOne(id);
    
    // Verificar si la entidad tiene la propiedad 'estado'
    if ('estado' in entity) {
      // Usar una aserción de tipo para evitar el error de TypeScript
      (entity as any).estado = false;
      const savedEntity = await this.repository.save(entity);
      return savedEntity as unknown as T;
    } else {
      throw new Error('La entidad no tiene un campo "estado" para realizar eliminación lógica');
    }
  }
}
