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
    @InjectRepository(CategoriaElemento)
    private readonly categoriaRepo: Repository<CategoriaElemento>,
    @InjectRepository(TipoMaterial)
    private readonly tipoMaterialRepo: Repository<TipoMaterial>,
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>,
  ) {}

  async create(dto: CreateMaterialeDto): Promise<Material> {
    try {
      const { categoria_id, tipo_material_id, sitio_id, ...materialData } = dto;

      const nuevoMaterial = this.materialRepo.create(materialData);
      const materialGuardado = await this.materialRepo.save(nuevoMaterial);

      if (categoria_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'categoria') // ← nombre de la relación en la entidad
          .of(materialGuardado.id_material)
          .set(categoria_id);
      }

      if (tipo_material_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'tipoMaterial')
          .of(materialGuardado.id_material)
          .set(tipo_material_id);
      }

      if (sitio_id) {
        await this.materialRepo.createQueryBuilder()
          .relation(Material, 'sitio')
          .of(materialGuardado.id_material)
          .set(sitio_id);
      }

      return this.findOne(materialGuardado.id_material);
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  }

  async findAll(): Promise<Material[]> {
    return this.materialRepo.find({
      relations: ['categoria_id', 'tipo_material_id'],
    });
  }

  async findOne(id: number | string): Promise<Material> {
    const material = await this.materialRepo.findOne({
      where: { id_material: Number(id) },
      relations: ['categoria_id', 'tipo_material_id'],
    });

    if (!material) {
      throw new NotFoundException(`Material con ID ${id} no encontrado`);
    }

    return material;
  }

  async update(id: number | string, dto: UpdateMaterialeDto): Promise<Material> {
    const material = await this.findOne(id);

    Object.assign(material, dto);

    return this.materialRepo.save(material);
  }

  async remove(id: number | string): Promise<boolean> {
    const result = await this.materialRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
