import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/materiale.entity';
import { CreateMaterialeDto } from './dto/create-materiale.dto';
import { UpdateMaterialeDto } from './dto/update-materiale.dto';
import { CategoriaElemento } from '../categoria-elementos/entities/categoria-elemento.entity';
import { TipoMaterial } from '../tipo-materiales/entities/tipo-materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
  ) {}

  async create(dto: CreateMaterialeDto): Promise<Material> {
    try {
      // Crear una nueva instancia de material con los datos básicos y relaciones
      const nuevoMaterial = this.materialRepo.create({
        codigo_sena: dto.codigo_sena,
        nombre_material: dto.nombre_material,
        descripcion_material: dto.descripcion_material,
        stock: dto.stock,
        unidad_medida: dto.unidad_medida,
        producto_perecedero: dto.producto_perecedero,
        estado: dto.estado,
        fecha_vencimiento: dto.fecha_vencimiento,
        imagen: dto.imagen // Guardar la URL o ruta de la imagen
      });
      
      // Guardar el material sin relaciones primero
      const materialGuardado = await this.materialRepo.save(nuevoMaterial);
      
      // Establecer las relaciones usando queryBuilder
      if (dto.categoria_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'categoria_id')
          .of(materialGuardado.id_material)
          .set(dto.categoria_id);
      }
      
      if (dto.tipo_material_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'tipo_material_id')
          .of(materialGuardado.id_material)
          .set(dto.tipo_material_id);
      }
      
      if (dto.sitio_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'sitio_id')
          .of(materialGuardado.id_material)
          .set(dto.sitio_id);
      }
      
      // Buscar el material con todas sus relaciones para devolverlo completo
      const materialCompleto = await this.materialRepo.findOne({
        where: { id_material: materialGuardado.id_material },
        relations: ['categoria_id', 'tipo_material_id', 'sitio_id'],
      });
      
      if (!materialCompleto) {
        throw new NotFoundException(`No se pudo encontrar el material recién creado`);
      }
      
      return materialCompleto;
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  }
  
  async findAll(): Promise<Material[]> {
    return this.materialRepo.find({
      relations: ['categoria_id', 'tipo_material_id', 'sitio_id'],
    });
  }

  async findOne(id: number): Promise<Material> {
    const material = await this.materialRepo.findOne({
      where: { id_material: id },
      relations: ['categoria_id', 'tipo_material_id', 'sitio_id'],
    });
    if (!material) {
      throw new NotFoundException(`Material con ID ${id} no encontrado`);
    }
    return material;
  }

  async update(id: number, dto: UpdateMaterialeDto): Promise<Material> {
    const existente = await this.findOne(id);
    const actualizado = Object.assign(existente, dto);
    return this.materialRepo.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const result = await this.materialRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Material con ID ${id} no encontrado`);
    }
  }
}
