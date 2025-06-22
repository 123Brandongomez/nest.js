import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { Caracteristica } from '../caracteristicas/entities/caracteristica.entity'; // Importa la entidad Caracteristica

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>,
    @InjectRepository(Caracteristica)
    private readonly caracteristicaRepo: Repository<Caracteristica>, // Inyecta el repositorio
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
  const { sitio_id, material_id, stock, placa_sena, descripcion } = createInventarioDto;

  const sitio = await this.sitioRepo.findOneBy({ id_sitio: sitio_id });
  if (!sitio) throw new NotFoundException(`Sitio con ID ${sitio_id} no encontrado`);

  // Traer las características del material
  const caracteristica = await this.caracteristicaRepo.findOne({
    where: { material: { id_material: material_id } },
    relations: ['material'],
  });

  if (!caracteristica) throw new NotFoundException(`Características para el material ${material_id} no encontradas`);

  const inventario = this.inventarioRepo.create({ sitio, stock });

  // Validar si se requiere cada dato y si se recibió
  if (caracteristica.placa_sena) {
    if (!placa_sena) {
      throw new BadRequestException(`Se requiere el valor de "placa_sena" para este material`);
    }
    inventario.placa_sena = placa_sena;
  }

  if (caracteristica.descripcion) {
    if (!descripcion) {
      throw new BadRequestException(`Se requiere la "descripcion" para este material`);
    }
    inventario.descripcion = descripcion;
  }

  return this.inventarioRepo.save(inventario);
}


  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      relations: ['sitio']
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOne({
      where: { id_inventario: id },
      relations: ['sitio']
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async findBySitio(sitioId: number): Promise<Inventario | null> {
    return this.inventarioRepo.findOne({
      where: { sitio: { id_sitio: sitioId } },
      relations: ['sitio']
    });
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);

    if (updateInventarioDto.sitio_id) {
      const sitio = await this.sitioRepo.findOneBy({ id_sitio: updateInventarioDto.sitio_id });
      if (!sitio) {
        throw new NotFoundException(`Sitio con ID ${updateInventarioDto.sitio_id} no encontrado`);
      }
      inventario.sitio = sitio;
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

  async actualizarStock(sitioId: number, cantidad: number): Promise<Inventario> {
    let inventario = await this.findBySitio(sitioId);

    if (!inventario && cantidad > 0) {
      const sitio = await this.sitioRepo.findOneBy({ id_sitio: sitioId });
      if (!sitio) {
        throw new NotFoundException(`Sitio con ID ${sitioId} no encontrado`);
      }

      inventario = this.inventarioRepo.create();
      inventario.sitio = sitio;
      inventario.stock = cantidad;
    } else if (!inventario && cantidad < 0) {
      throw new BadRequestException(`No existe inventario para el sitio ${sitioId}`);
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
