import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';
import { Sede } from './entities/sede.entity';
import { Centro } from '../centros/entities/centro.entity'; // Importa la entidad Centro

@Injectable()
export class SedesService {
  constructor(
    @InjectRepository(Sede)
    private readonly sedeRepository: Repository<Sede>,
  ) {}

  async create(createSedeDto: CreateSedeDto) {
    const { centroId, ...rest } = createSedeDto;



    const centro = centroId
      ? await this.sedeRepository.manager.findOne(Centro, { where: { id_centro: centroId } })
      : null;

    if (centroId && !centro) {
      throw new NotFoundException(`Centro with ID ${centroId} not found`);
    }

    const sede = this.sedeRepository.create({
      ...rest,
      ...(centro ? { centro } : {}),
    });



    return await this.sedeRepository.save(sede);
  }

  async findAll() {
    return await this.sedeRepository.find({
      relations: ['centro', 'areas'],
    });
  }

  async findOne(id: number) {
    const sede = await this.sedeRepository.findOne({
      where: { id_sede: id },
      relations: ['centro', 'areas'],
    });
    
    if (!sede) {
      throw new NotFoundException(`Sede with ID ${id} not found`);
    }
    
    return sede;
  }

  async update(id: number, updateSedeDto: UpdateSedeDto) {
    const { centroId, ...rest } = updateSedeDto;

    const sede = await this.findOne(id);

    let centro: Centro | null = null;
    if (centroId) {
      centro = await this.sedeRepository.manager.findOne(Centro, { where: { id_centro: centroId } });
      if (!centro) {
        throw new NotFoundException(`Centro with ID ${centroId} not found`);
      }
    }

    Object.assign(sede, rest, centro ? { centro } : {});

    return await this.sedeRepository.save(sede);
  }

  async remove(id: number) {
    const sede = await this.findOne(id);
    return await this.sedeRepository.remove(sede);
  }
}
