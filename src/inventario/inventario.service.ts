import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';
import { Material } from '../materiales/entities/materiale.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    const material = await this.materialRepo.findOneBy({ id_material: createInventarioDto.material_id });
    if (!material) {
      throw new NotFoundException(`Material con ID ${createInventarioDto.material_id} no encontrado`);
    }

    const inventarioExistente = await this.inventarioRepo.findOne({
      where: {
        material: { id_material: createInventarioDto.material_id }
      },
      relations: ['material']
    });

    if (inventarioExistente) {
      inventarioExistente.stock += createInventarioDto.stock;
      return this.inventarioRepo.save(inventarioExistente);
    } else {
      const nuevoInventario = this.inventarioRepo.create();
      nuevoInventario.material = material;
      nuevoInventario.stock = createInventarioDto.stock;
      return this.inventarioRepo.save(nuevoInventario);
    }
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      relations: ['material']
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOne({
      where: { id_inventario: id },
      relations: ['material']
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);

    if (updateInventarioDto.material_id) {
      const material = await this.materialRepo.findOneBy({ id_material: updateInventarioDto.material_id });
      if (!material) {
        throw new NotFoundException(`Material con ID ${updateInventarioDto.material_id} no encontrado`);
      }
      inventario.material = material;
    }

    if (updateInventarioDto.stock !== undefined) {
      inventario.stock = updateInventarioDto.stock;
    }

    return this.inventarioRepo.save(inventario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventarioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
  }

  async actualizarStock(materialId: number, cantidad: number): Promise<Inventario> {
    let inventario = await this.inventarioRepo.findOne({
      where: { material: { id_material: materialId } },
      relations: ['material']
    });

    if (!inventario && cantidad > 0) {
      const material = await this.materialRepo.findOneBy({ id_material: materialId });
      if (!material) {
        throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
      }

      inventario = this.inventarioRepo.create();
      inventario.material = material;
      inventario.stock = cantidad;
    } else if (!inventario && cantidad < 0) {
      throw new BadRequestException(`No existe inventario para el material ${materialId}`);
    } else if (inventario) {
      const nuevoStock = inventario.stock + cantidad;
      if (nuevoStock < 0) {
        throw new BadRequestException(`Stock insuficiente. Stock actual: ${inventario.stock}, Cantidad a restar: ${Math.abs(cantidad)}`);
      }
      inventario.stock = nuevoStock;
    } else {
      throw new BadRequestException('Error inesperado al actualizar el inventario');
    }

    return this.inventarioRepo.save(inventario);
  }
}
