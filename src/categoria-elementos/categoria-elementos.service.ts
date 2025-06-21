import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaElemento } from './entities/categoria-elemento.entity';
import { CreateCategoriaElementoDto } from './dto/create-categoria-elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria-elemento.dto';

@Injectable()
export class CategoriaElementoService {
  constructor(
    @InjectRepository(CategoriaElemento)
    private readonly categoriaElementoRepo: Repository<CategoriaElemento>,
  ) {}

  async create(dto: CreateCategoriaElementoDto): Promise<CategoriaElemento> {
    const nuevo = this.categoriaElementoRepo.create(dto);
    return this.categoriaElementoRepo.save(nuevo);
  }

  async findAll(): Promise<CategoriaElemento[]> {
    return this.categoriaElementoRepo.find();
  }

  async findOne(id: number): Promise<CategoriaElemento> {
    const categoria = await this.categoriaElementoRepo.findOneBy({ id_categoria_elemento: id });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async update(id: number, dto: UpdateCategoriaElementoDto): Promise<CategoriaElemento> {
    const categoria = await this.findOne(id);
    const actualizada = Object.assign(categoria, dto);
    return this.categoriaElementoRepo.save(actualizada);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriaElementoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
  }
}
