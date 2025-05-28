import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    private readonly inventarioManager: InventarioManagerService
  ) {}

  /**
   * Crea una nueva característica para un material y actualiza el inventario
   * @param dto Datos para crear la característica
   * @returns La característica creada
   */
  async create(dto: CreateCaracteristicaDto): Promise<Caracteristica> {
    // Validar que exista el material
    const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
    if (!material) {
      throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);
    }

    // Crear la característica
    const caracteristica = this.caracteristicaRepo.create();
    caracteristica.placa_sena = dto.placa_sena;
    caracteristica.descripcion = dto.descripcion;
    caracteristica.material = material;

    // Guardar la característica
    const caracteristicaGuardada = await this.caracteristicaRepo.save(caracteristica);

    // Actualizar el stock en el inventario si se especifica un sitio
    if (dto.sitio_id) {
      try {
        // Aumentar el stock en 1 unidad en el sitio especificado usando el servicio común
        await this.inventarioManager.registrarNuevaCaracteristica(dto.material_id, dto.sitio_id);
      } catch (error) {
        // Si hay un error al actualizar el inventario, lo registramos pero no impedimos la creación de la característica
        console.error(`Error al actualizar el inventario: ${error.message}`);
      }
    }

    return caracteristicaGuardada;
  }

  /**
   * Obtiene todas las características
   * @returns Lista de características
   */
  async findAll(): Promise<Caracteristica[]> {
    return this.caracteristicaRepo.find({
      relations: ['material']
    });
  }

  /**
   * Obtiene una característica por su ID
   * @param id ID de la característica
   * @returns La característica encontrada
   */
  async findOne(id: number): Promise<Caracteristica> {
    const caracteristica = await this.caracteristicaRepo.findOne({
      where: { id_caracteristica: id },
      relations: ['material']
    });

    if (!caracteristica) {
      throw new NotFoundException(`Característica con ID ${id} no encontrada`);
    }

    return caracteristica;
  }

  /**
   * Actualiza una característica
   * @param id ID de la característica
   * @param dto Datos para actualizar
   * @returns La característica actualizada
   */
  async update(id: number, dto: UpdateCaracteristicaDto): Promise<Caracteristica> {
    const caracteristica = await this.findOne(id);

    // Actualizar material si es necesario
    if (dto.material_id) {
      const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
      if (!material) {
        throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);
      }
      caracteristica.material = material;
    }

    // Actualizar otros campos
    if (dto.placa_sena) caracteristica.placa_sena = dto.placa_sena;
    if (dto.descripcion) caracteristica.descripcion = dto.descripcion;

    return this.caracteristicaRepo.save(caracteristica);
  }

  /**
   * Elimina una característica
   * @param id ID de la característica
   */
  async remove(id: number): Promise<void> {
    const caracteristica = await this.findOne(id);
    
    // Obtener el material y sitio antes de eliminar
    const materialId = caracteristica.material?.id_material;
    
    const result = await this.caracteristicaRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Característica con ID ${id} no encontrada`);
    }
  }
}
