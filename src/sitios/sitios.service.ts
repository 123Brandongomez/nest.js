import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sitio } from './entities/sitio.entity';
import { TipoSitio } from 'src/tipo-sitios/entities/tipo-sitio.entity'; // Asegúrate de importar correctamente TipoSitio
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Injectable()
export class SitioService {
  constructor(
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>,

    @InjectRepository(TipoSitio)
    private readonly tipoSitioRepo: Repository<TipoSitio>,  // Repositorio de TipoSitio
  ) {}

  async create(dto: CreateSitioDto): Promise<Sitio> {
    
    // Buscar la entidad TipoSitio por su ID
    const tipoSitio = await this.tipoSitioRepo.findOneBy({ id_tipo_sitio: dto.tipo_sitio_id });
    if (!tipoSitio) {
      throw new NotFoundException(`TipoSitio con ID ${dto.tipo_sitio_id} no encontrado`);
    }

    // Crear el nuevo Sitio, asignando la entidad completa a la relación
    const nuevo = this.sitioRepo.create({
      ...dto,
      tipo_sitio_id: tipoSitio,  // Asignamos el objeto TipoSitio completo
    });

    return this.sitioRepo.save(nuevo);
  }

  async findAll(): Promise<Sitio[]> {
    return this.sitioRepo.find();
  }

  async findOne(id: number): Promise<Sitio> {
    const sitio = await this.sitioRepo.findOneBy({ id_sitio: id });
    if (!sitio) {
      throw new NotFoundException(`Sitio con ID ${id} no encontrado`);
    }
    return sitio;
  }

  async update(id: number, dto: UpdateSitioDto): Promise<Sitio> {
    const sitio = await this.findOne(id);
    const actualizado = Object.assign(sitio, dto);
    return this.sitioRepo.save(actualizado);
  }

  async remove(id: number): Promise<void> {
    const result = await this.sitioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sitio con ID ${id} no encontrado`);
    }
  }
}
