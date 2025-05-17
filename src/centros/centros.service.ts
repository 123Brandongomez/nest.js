import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';
import { Centro } from './entities/centro.entity';
import { Municipio } from '../municipios/entities/municipio.entity'; // Importa la entidad Municipio

@Injectable()
export class CentrosService {
  constructor(
    @InjectRepository(Centro)
    private readonly centroRepository: Repository<Centro>,
  ) {}

  async create(createCentroDto: CreateCentroDto) {
    const { id_municipio, ...rest } = createCentroDto;

    const municipio = id_municipio
      ? await this.centroRepository.manager.findOne(Municipio, { where: { id_municipio: id_municipio } })
      : null;

    if (id_municipio && !municipio) {
      throw new NotFoundException(`Municipio with ID ${id_municipio} not found`);
    }

    const centro = this.centroRepository.create({
      ...rest,
      ...(municipio && { municipio }),
    });

    const savedCentro = await this.centroRepository.save(centro);
    // Return the centro with municipio and sedes relations populated
    return await this.centroRepository.findOne({
      where: { id_centro: savedCentro.id_centro },
      relations: ['municipio', 'sedes'],
    });
  }

  async findAll() {
    return await this.centroRepository.find({
      relations: ['municipio', 'sedes'],
    });
  }

  async findOne(id: number) {
    const centro = await this.centroRepository.findOne({
      where: { id_centro: id },
      relations: ['municipio', 'sedes'],
    });
    
    if (!centro) {
      throw new NotFoundException(`Centro with ID ${id} not found`);
    }
    
    return centro;
  }

  async update(id: number, updateCentroDto: UpdateCentroDto) {
    const centro = await this.findOne(id);

    // Si viene id_municipio, buscar el municipio y asignarlo
    if (updateCentroDto.id_municipio) {
      const municipio = await this.centroRepository.manager.findOne(Municipio, {
        where: { id_municipio: updateCentroDto.id_municipio },
      });
      if (!municipio) {
        throw new NotFoundException(`Municipio with ID ${updateCentroDto.id_municipio} not found`);
      }
      centro.municipio = municipio;
    }

    // Asignar los demás campos (excepto id_municipio)
    Object.assign(centro, { ...updateCentroDto, id_municipio: undefined });
    await this.centroRepository.save(centro);

    // Devolver el centro con relaciones pobladas
    return await this.centroRepository.findOne({
      where: { id_centro: id },
      relations: ['municipio', 'sedes'],
    });
  }

  async remove(id: number) {
    const centro = await this.findOne(id);
    return await this.centroRepository.remove(centro);
  }
}
