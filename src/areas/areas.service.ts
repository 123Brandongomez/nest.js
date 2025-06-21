import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { Sede } from '../sedes/entities/sede.entity'; // Importa la entidad Sede

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const { id_sede, ...rest } = createAreaDto;
    const sede = id_sede
      ? await this.areaRepository.manager.findOne(Sede, {
          where: { id_sede: id_sede },
        })
      : undefined;

    if (id_sede && !sede) {
      throw new NotFoundException(`Sede with ID ${id_sede} not found`);
    }

    const area = this.areaRepository.create({ 
      ...rest,
      ...(sede && { sede }),
    });

    return await this.areaRepository.save(area);
  }

  async findAll() {
    return await this.areaRepository.find({
      relations: ['sede', 'programas'],
    });
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOne({
      where: { id_area: id },
      relations: ['sede', 'programas'],
    });

    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id);

    Object.assign(area, updateAreaDto);
    return await this.areaRepository.save(area);
  }

  async remove(id: number) {
    const area = await this.findOne(id);
    return await this.areaRepository.remove(area);
  }
}
