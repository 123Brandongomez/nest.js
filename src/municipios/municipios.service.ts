import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import { Municipio } from './entities/municipio.entity';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepository: Repository<Municipio>,
  ) {}

  async create(createMunicipioDto: CreateMunicipioDto) {
    const municipio = this.municipioRepository.create({
      ...createMunicipioDto,
      centros: [] 
    });
    return await this.municipioRepository.save(municipio);
  }

  async findAll() {
    return await this.municipioRepository.find({
      relations: ['centros'],
    });
  }

  async findOne(id: number) {
    const municipio = await this.municipioRepository.findOne({
      where: { id_municipio: id },
      relations: ['centros'],
    });
    
    if (!municipio) {
      throw new NotFoundException(`Municipio with ID ${id} not found`);
    }
    
    return municipio;
  }

  async update(id: number, updateMunicipioDto: UpdateMunicipioDto) {
    const municipio = await this.findOne(id);
    
    Object.assign(municipio, updateMunicipioDto);
    return await this.municipioRepository.save(municipio);
  }

  async remove(id: number) {
    const municipio = await this.findOne(id);
    return await this.municipioRepository.remove(municipio);
  }
}
