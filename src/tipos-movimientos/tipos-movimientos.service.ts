import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMovimiento } from './entities/tipos-movimiento.entity';
import { CreateTiposMovimientoDto } from './dto/create-tipos-movimiento.dto';
import { UpdateTiposMovimientoDto } from './dto/update-tipos-movimiento.dto';

@Injectable()
export class TiposMovimientoService {
  constructor(
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepo: Repository<TipoMovimiento>,
  ) {}

  async create(dto: CreateTiposMovimientoDto): Promise<TipoMovimiento> {
    const nuevo = this.tipoMovimientoRepo.create(dto);
    return this.tipoMovimientoRepo.save(nuevo);
  }

  async findAll(): Promise<TipoMovimiento[]> {
    return this.tipoMovimientoRepo.find();
  }

  async findOne(id: number): Promise<TipoMovimiento> {
    const tipo = await this.tipoMovimientoRepo.findOneBy({ id_tipo_movimiento: id });
    if (!tipo) throw new NotFoundException(`TipoMovimiento con ID ${id} no encontrado`);
    return tipo;
  }

  async update(id: number, dto: UpdateTiposMovimientoDto): Promise<TipoMovimiento> {
    const tipo = await this.findOne(id);
    // Asignación explícita del campo 'estado' para evitar problemas con valores undefined o falsy
    if (dto.estado !== undefined) {
      tipo.estado = dto.estado;
    }
    Object.assign(tipo, dto);
    return this.tipoMovimientoRepo.save(tipo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tipoMovimientoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoMovimiento con ID ${id} no encontrado`);
    }
  }
}
