import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMaterial } from './entities/tipo-materiale.entity';
import { CreateTipoMaterialeDto } from './dto/create-tipo-materiale.dto';
import { UpdateTipoMaterialeDto } from './dto/update-tipo-materiale.dto';

@Injectable()
export class TipoMaterialService {
  constructor(
    @InjectRepository(TipoMaterial)
    private readonly tipoMaterialRepo: Repository<TipoMaterial>,
  ) {}

  async create(dto: CreateTipoMaterialeDto): Promise<TipoMaterial> {
    const nuevoTipoMaterial = this.tipoMaterialRepo.create({
      ...dto,
      id_tipo_material: undefined, // Set default or handle appropriately
      materiales: [], // Initialize with default value or handle as needed
      tipo_elemento: dto.tipo_elemento.toString(), // Ensure tipo_elemento is a string
    });
    return this.tipoMaterialRepo.save(nuevoTipoMaterial);
  }
  

  async findAll(): Promise<TipoMaterial[]> {
    return this.tipoMaterialRepo.find();
  }

  async findOne(id: number): Promise<TipoMaterial> {
    const tipoMaterial = await this.tipoMaterialRepo.findOneBy({ id_tipo_material: id });
    if (!tipoMaterial) {
      throw new NotFoundException(`TipoMaterial con ID ${id} no encontrado`);
    }
    return tipoMaterial;
  }

  async update(id: number, dto: UpdateTipoMaterialeDto): Promise<TipoMaterial> {
    const existente = await this.findOne(id);
    const actualizado = Object.assign(existente, dto);
    return this.tipoMaterialRepo.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tipoMaterialRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoMaterial con ID ${id} no encontrado`);
    }
  }
}
