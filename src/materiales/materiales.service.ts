import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/materiale.entity';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { CategoriaElemento } from '../categoria-elementos/entities/categoria-elemento.entity';
import { TipoMaterial } from '../tipo-materiales/entities/tipo-materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { CustomIdCrudService } from '../common/services/custom-id-crud.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class MaterialesService extends CustomIdCrudService<Material, CreateMaterialeDto, UpdateMaterialeDto> {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    @InjectRepository(CategoriaElemento)
    private readonly categoriaRepo: Repository<CategoriaElemento>,
    @InjectRepository(TipoMaterial)
    private readonly tipoMaterialRepo: Repository<TipoMaterial>,
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>
  ) {
    super(materialRepo, 'id_material');
  }

  /**
   * Sobreescribe el método create de la clase base para manejar las relaciones
   * @param dto DTO con los datos para crear el material
   * @returns Material creado
   */
  async create(dto: CreateMaterialeDto): Promise<Material> {
    try {
      // Extraer los IDs de relaciones del DTO
      const { categoria_id, tipo_material_id, sitio_id, ...materialData } = dto;
      
      // Crear una nueva instancia de material con los datos básicos
      const nuevoMaterial = this.materialRepo.create(materialData);
      
      // Guardar el material sin relaciones primero
      const materialGuardado = await this.materialRepo.save(nuevoMaterial);
      
      // Establecer las relaciones usando queryBuilder
      if (categoria_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'categoria_id')
          .of(materialGuardado.id_material)
          .set(categoria_id);
      }
      
      if (tipo_material_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'tipo_material_id')
          .of(materialGuardado.id_material)
          .set(tipo_material_id);
      }
      
      if (sitio_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'sitio_id')
          .of(materialGuardado.id_material)
          .set(sitio_id);
      }
      
      // Buscar el material con todas sus relaciones para devolverlo completo
      return this.findOne(materialGuardado.id_material);
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  }
  
  /**
   * Sobreescribe el método findAll de la clase base para incluir relaciones por defecto
   * @param paginationQuery Parámetros de paginación (opcional)
   * @returns Respuesta paginada con los materiales
   */
  async findAll(paginationQuery?: PaginationQueryDto): Promise<PaginationDto<Material>> {
    // Llamar al método de la clase base con las relaciones que queremos cargar
    return super.findAll(paginationQuery, ['categoria_id', 'tipo_material_id', 'sitio_id']);
  }

  /**
   * Sobreescribe el método findOne de la clase base para incluir relaciones por defecto
   * @param id ID del material a buscar
   * @returns Material encontrado
   */
  async findOne(id: number | string): Promise<Material> {
    // Llamar al mu00e9todo de la clase base con las relaciones que queremos cargar
    return super.findOne(id, ['categoria_id', 'tipo_material_id', 'sitio_id']);
  }

  /**
   * Sobreescribe el mu00e9todo update de la clase base para manejar las relaciones
   * @param id ID del material a actualizar
   * @param dto DTO con los datos para actualizar
   * @returns Material actualizado
   */
  async update(id: number | string, dto: UpdateMaterialeDto): Promise<Material> {
    // Obtener el material existente con sus relaciones
    const existente = await this.findOne(id);
    
    // Aplicar los cambios al material
    const actualizado = Object.assign(existente, dto);
    
    // Guardar y devolver el material actualizado
    return this.materialRepo.save(actualizado) as unknown as Material;
  }

  /**
   * Sobreescribe el método remove de la clase base
   * @param id ID del material a eliminar
   * @returns true si el material fue eliminado correctamente
   */
  async remove(id: number | string): Promise<boolean> {
    // Usar directamente el método remove de la clase base
    return super.remove(id);
  }
}
