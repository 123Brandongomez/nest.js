import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoSitio } from './entities/tipo-sitio.entity';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';

@Injectable()
export class TipoSitiosService {
  constructor(
    @InjectRepository(TipoSitio)
    private readonly tipoSitioRepo: Repository<TipoSitio>,
  ) {}

  async create(dto: CreateTipoSitioDto): Promise<TipoSitio> {
    const nuevo = this.tipoSitioRepo.create(dto);
    return this.tipoSitioRepo.save(nuevo);
  }

  async findAll(): Promise<TipoSitio[]> {
    return this.tipoSitioRepo.find();
  }

  async findOne(id: number): Promise<TipoSitio> {
    const tipo = await this.tipoSitioRepo.findOneBy({ id_tipo_sitio: id });
    if (!tipo) {
      throw new NotFoundException(`TipoSitio con ID ${id} no encontrado`);
    }
    return tipo;
  }

  async update(id: number, dto: UpdateTipoSitioDto): Promise<TipoSitio> {
    const existente = await this.findOne(id);
    const actualizado = Object.assign(existente, dto);
    return this.tipoSitioRepo.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tipoSitioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoSitio con ID ${id} no encontrado`);
    }
  }
}
