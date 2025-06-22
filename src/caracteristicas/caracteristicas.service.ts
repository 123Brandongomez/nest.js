import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCaracteristicaDto } from './dto/create-caracteristica.dto';
import { UpdateCaracteristicaDto } from './dto/update-caracteristica.dto';
import { Caracteristica } from './entities/caracteristica.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { InventarioManagerService } from '../common/services/inventario-manager.service';

@Injectable()
export class CaracteristicasService {
  constructor(
    @InjectRepository(Caracteristica)
    private readonly caracteristicaRepo: Repository<Caracteristica>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    private readonly inventarioManager: InventarioManagerService,
  ) {}

  /**
   * Crea una nueva configuración de características para un material.
   * @param dto Datos con los flags booleanos
   * @returns La característica guardada
   */
  async create(dto: CreateCaracteristicaDto): Promise<Caracteristica> {
    // Validar que exista el material
    const material = await this.materialRepo.findOneBy({
      id_material: dto.material_id,
    });
    if (!material) {
      throw new NotFoundException(
        `Material con ID ${dto.material_id} no encontrado`,
      );
    }

    // Verificar si ya existe una configuración para ese material
    const existente = await this.caracteristicaRepo.findOne({
      where: { material: { id_material: dto.material_id } },
    });
    if (existente) {
      throw new BadRequestException(
        `Ya existe una configuración de características para este material.`,
      );
    }

    // Crear y guardar características
    const caracteristica = this.caracteristicaRepo.create({
      placa_sena: dto.placa_sena ?? false,
      descripcion: dto.descripcion ?? false,
      material,
    });

    return this.caracteristicaRepo.save(caracteristica);
  }

  async findAll(): Promise<Caracteristica[]> {
    return this.caracteristicaRepo.find({ relations: ['material'] });
  }

  async findOne(id: number): Promise<Caracteristica> {
    const caracteristica = await this.caracteristicaRepo.findOne({
      where: { id_caracteristica: id },
      relations: ['material'],
    });

    if (!caracteristica) {
      throw new NotFoundException(
        `Característica con ID ${id} no encontrada`,
      );
    }

    return caracteristica;
  }

  async update(
    id: number,
    dto: UpdateCaracteristicaDto,
  ): Promise<Caracteristica> {
    const caracteristica = await this.findOne(id);

    if (dto.material_id) {
      const material = await this.materialRepo.findOneBy({
        id_material: dto.material_id,
      });
      if (!material) {
        throw new NotFoundException(
          `Material con ID ${dto.material_id} no encontrado`,
        );
      }
      caracteristica.material = material;
    }

    if (dto.placa_sena !== undefined)
      caracteristica.placa_sena = dto.placa_sena;
    if (dto.descripcion !== undefined)
      caracteristica.descripcion = dto.descripcion;

    return this.caracteristicaRepo.save(caracteristica);
  }

  async remove(id: number): Promise<void> {
    const caracteristica = await this.findOne(id);

    const result = await this.caracteristicaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Característica con ID ${id} no encontrada`,
      );
    }
  }
}
