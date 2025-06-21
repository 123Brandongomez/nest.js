import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProgramaDto } from './dto/create-programa.dto';
import { UpdateProgramaDto } from './dto/update-programa.dto';
import { Programa } from './entities/programa.entity';
import { Area } from 'src/areas/entities/area.entity';


@Injectable()
export class ProgramasService {
  constructor(
    @InjectRepository(Programa)
    private readonly programaRepository: Repository<Programa>,
  ) {}

  async create(createProgramaDto: CreateProgramaDto) {
    const { area_id, ...rest } = createProgramaDto;

    const area = await this.programaRepository.manager.findOne(Area, {
      where: { id_area: area_id },
    });

    if (!area) {
      throw new NotFoundException(`Area with ID ${area_id} not found`);
    }

    const programa = this.programaRepository.create({
      ...rest,
      area, // Asigna el objeto area a la relación
    });

    return await this.programaRepository.save(programa);
  }
  

  async findAll() {
    return await this.programaRepository.find({
      relations: ['area', 'fichas'],
    });
  }

  async findOne(id: number) {
    const programa = await this.programaRepository.findOne({
      where: { id_programa: id },
      relations: ['area', 'fichas'],
    });
    
    if (!programa) {
      throw new NotFoundException(`Programa with ID ${id} not found`);
    }
    
    return programa;
  }

  async update(id: number, updateProgramaDto: UpdateProgramaDto) {
    const programa = await this.findOne(id);
    
    Object.assign(programa, updateProgramaDto);
    return await this.programaRepository.save(programa);
  }

  async remove(id: number) {
    const programa = await this.findOne(id);
    return await this.programaRepository.remove(programa);
  }
}
