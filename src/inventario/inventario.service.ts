import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { Inventario } from './entities/inventario.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { Sitio } from '../sitios/entities/sitio.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    @InjectRepository(Sitio)
    private readonly sitioRepo: Repository<Sitio>,
  ) {}

  /**
   * Crea un nuevo registro de inventario
   * @param createInventarioDto Datos para crear el inventario
   * @returns El inventario creado
   */
  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    // Validar que exista el material
    const material = await this.materialRepo.findOneBy({ id_material: createInventarioDto.material_id });
    if (!material) {
      throw new NotFoundException(`Material con ID ${createInventarioDto.material_id} no encontrado`);
    }

    // Validar que exista el sitio
    const sitio = await this.sitioRepo.findOneBy({ id_sitio: createInventarioDto.sitio_id });
    if (!sitio) {
      throw new NotFoundException(`Sitio con ID ${createInventarioDto.sitio_id} no encontrado`);
    }

    // Verificar si ya existe un inventario para este material y sitio
    const inventarioExistente = await this.inventarioRepo.findOne({
      where: {
        material: { id_material: createInventarioDto.material_id },
        sitio: { id_sitio: createInventarioDto.sitio_id }
      },
      relations: ['material', 'sitio']
    });

    if (inventarioExistente) {
      // Si ya existe, actualizar el stock
      inventarioExistente.stock += createInventarioDto.stock;
      return this.inventarioRepo.save(inventarioExistente);
    } else {
      // Si no existe, crear un nuevo registro
      const nuevoInventario = this.inventarioRepo.create();
      nuevoInventario.material = material;
      nuevoInventario.sitio = sitio;
      nuevoInventario.stock = createInventarioDto.stock;
      return this.inventarioRepo.save(nuevoInventario);
    }
  }

  /**
   * Obtiene todos los registros de inventario
   * @returns Lista de inventarios
   */
  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepo.find({
      relations: ['material', 'sitio']
    });
  }

  /**
   * Obtiene un registro de inventario por su ID
   * @param id ID del inventario
   * @returns El inventario encontrado
   */
  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepo.findOne({
      where: { id_inventario: id },
      relations: ['material', 'sitio']
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  /**
   * Obtiene el inventario por material y sitio
   * @param materialId ID del material
   * @param sitioId ID del sitio
   * @returns El inventario encontrado o null si no existe
   */
  async findByMaterialAndSitio(materialId: number, sitioId: number): Promise<Inventario | null> {
    return this.inventarioRepo.findOne({
      where: {
        material: { id_material: materialId },
        sitio: { id_sitio: sitioId }
      },
      relations: ['material', 'sitio']
    });
  }

  /**
   * Actualiza un registro de inventario
   * @param id ID del inventario
   * @param updateInventarioDto Datos para actualizar
   * @returns El inventario actualizado
   */
  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);

    // Actualizar material si es necesario
    if (updateInventarioDto.material_id) {
      const material = await this.materialRepo.findOneBy({ id_material: updateInventarioDto.material_id });
      if (!material) {
        throw new NotFoundException(`Material con ID ${updateInventarioDto.material_id} no encontrado`);
      }
      inventario.material = material;
    }

    // Actualizar sitio si es necesario
    if (updateInventarioDto.sitio_id) {
      const sitio = await this.sitioRepo.findOneBy({ id_sitio: updateInventarioDto.sitio_id });
      if (!sitio) {
        throw new NotFoundException(`Sitio con ID ${updateInventarioDto.sitio_id} no encontrado`);
      }
      inventario.sitio = sitio;
    }

    // Actualizar stock si es necesario
    if (updateInventarioDto.stock !== undefined) {
      inventario.stock = updateInventarioDto.stock;
    }

    return this.inventarioRepo.save(inventario);
  }

  /**
   * Elimina un registro de inventario
   * @param id ID del inventario
   */
  async remove(id: number): Promise<void> {
    const result = await this.inventarioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
  }

  /**
   * Actualiza el stock de un material en un sitio específico
   * @param materialId ID del material
   * @param sitioId ID del sitio
   * @param cantidad Cantidad a añadir (positiva) o restar (negativa)
   * @returns El inventario actualizado
   */
  async actualizarStock(materialId: number, sitioId: number, cantidad: number): Promise<Inventario> {
    // Buscar el inventario existente
    let inventario = await this.findByMaterialAndSitio(materialId, sitioId);

    // Si no existe y la cantidad es positiva, crear uno nuevo
    if (!inventario && cantidad > 0) {
      const material = await this.materialRepo.findOneBy({ id_material: materialId });
      if (!material) {
        throw new NotFoundException(`Material con ID ${materialId} no encontrado`);
      }

      const sitio = await this.sitioRepo.findOneBy({ id_sitio: sitioId });
      if (!sitio) {
        throw new NotFoundException(`Sitio con ID ${sitioId} no encontrado`);
      }

      inventario = this.inventarioRepo.create();
      inventario.material = material;
      inventario.sitio = sitio;
      inventario.stock = cantidad;
    } else if (!inventario && cantidad < 0) {
      // No se puede restar stock de un inventario que no existe
      throw new BadRequestException(`No existe inventario para el material ${materialId} en el sitio ${sitioId}`);
    } else if (inventario) {
      // Actualizar el stock existente
      const nuevoStock = inventario.stock + cantidad;
      
      // Validar que el stock no sea negativo
      if (nuevoStock < 0) {
        throw new BadRequestException(`Stock insuficiente. Stock actual: ${inventario.stock}, Cantidad a restar: ${Math.abs(cantidad)}`);
      }
      
      inventario.stock = nuevoStock;
    } else {
      throw new BadRequestException('Error inesperado al actualizar el inventario');
    }

    // En este punto, inventario no puede ser null
    return this.inventarioRepo.save(inventario);
  }
}
