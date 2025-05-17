// src/modulos/modulos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';
import { Modulo } from './entities/modulo.entity';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
  ) {}

  async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
    const modulo = this.moduloRepository.create(createModuloDto);
    return await this.moduloRepository.save(modulo);
  }

  findAll(): Promise<Modulo[]> {
    return this.moduloRepository.find();
  }

  async findOne(id: number): Promise<Modulo> {
    const modulo = await this.moduloRepository.findOne({ where: { id_modulo:id } });
    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${id} no encontrado`);
    }
    return modulo;
  }

  async update(id: number, updateModuloDto: UpdateModuloDto): Promise<Modulo> {
    const modulo = await this.findOne(id);
    Object.assign(modulo, updateModuloDto);
    return this.moduloRepository.save(modulo);
  }

  async remove(id: number): Promise<void> {
    const modulo = await this.findOne(id);
    await this.moduloRepository.remove(modulo);
  }
}
