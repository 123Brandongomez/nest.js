import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoMovimiento } from 'src/tipos-movimientos/entities/tipos-movimiento.entity';
import { Material } from '../materiales/entities/materiale.entity';
import { InventarioManagerService } from '../common/services/inventario-manager.service';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(TipoMovimiento)
    private readonly tipoMovimientoRepo: Repository<TipoMovimiento>,
    @InjectRepository(Material)
    private readonly materialRepo: Repository<Material>,
    private readonly inventarioManager: InventarioManagerService,
    private readonly entityManager: EntityManager
  ) {}

  private esMovimientoEntrada(tipoMovimiento: TipoMovimiento): boolean {
    const tipoNombre = tipoMovimiento.tipo_movimiento.toLowerCase();
    return tipoNombre.includes('entrada') ||
           tipoNombre.includes('ingreso') ||
           tipoNombre.includes('adicion') ||
           tipoNombre.includes('devolucion');
  }

  private esMovimientoSalida(tipoMovimiento: TipoMovimiento): boolean {
    const tipoNombre = tipoMovimiento.tipo_movimiento.toLowerCase();
    return tipoNombre.includes('salida') ||
           tipoNombre.includes('egreso') ||
           tipoNombre.includes('retiro');
  }

  private async actualizarStock(
    material: Material,
    tipoMovimiento: TipoMovimiento,
    cantidad: number
  ): Promise<boolean> {
    if (this.esMovimientoEntrada(tipoMovimiento)) {
      return await this.inventarioManager.registrarDevolucion(material.id_material, cantidad);
    } else if (this.esMovimientoSalida(tipoMovimiento)) {
      return await this.inventarioManager.registrarPrestamo(material.id_material, cantidad);
    } else {
      throw new BadRequestException(`Tipo de movimiento no reconocido: ${tipoMovimiento.tipo_movimiento}`);
    }
  }

  private async revertirMovimientoEnStock(
    material: Material,
    tipoMovimiento: TipoMovimiento,
    cantidad: number
  ): Promise<boolean> {
    if (this.esMovimientoEntrada(tipoMovimiento)) {
      return await this.inventarioManager.registrarPrestamo(material.id_material, cantidad);
    } else if (this.esMovimientoSalida(tipoMovimiento)) {
      return await this.inventarioManager.registrarDevolucion(material.id_material, cantidad);
    }
    return false;
  }

  async create(dto: CreateMovimientoDto): Promise<Movimiento> {
    const usuario = await this.usuarioRepo.findOneBy({ id_usuario: dto.usuario_id });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.usuario_id} no encontrado`);

    const tipo = await this.tipoMovimientoRepo.findOneBy({ id_tipo_movimiento: dto.tipo_movimiento });
    if (!tipo) throw new NotFoundException(`TipoMovimiento con ID ${dto.tipo_movimiento} no encontrado`);

    const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
    if (!material) throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);

    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor que cero');
    }

    const stockActualizado = await this.actualizarStock(material, tipo, dto.cantidad);
    if (!stockActualizado) {
      throw new BadRequestException('No se pudo actualizar el stock del material');
    }

    const nuevo = this.movimientoRepo.create();
    nuevo.estado = dto.estado;
    nuevo.usuario = usuario;
    nuevo.tipo_movimiento_id = tipo;
    nuevo.material_id = material;
    nuevo.cantidad = dto.cantidad;

    return this.movimientoRepo.save(nuevo);
  }

  async findAll(): Promise<Movimiento[]> {
    return this.movimientoRepo.find({ relations: ['usuario', 'tipo_movimiento_id'] });
  }

  async findOne(id: number): Promise<Movimiento> {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id_movimiento: id },
      relations: ['usuario', 'tipo_movimiento_id'],
    });
    if (!movimiento) throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    return movimiento;
  }

  async update(id: number, dto: UpdateMovimientoDto): Promise<Movimiento> {
    const movimientoOriginal = await this.movimientoRepo.findOne({
      where: { id_movimiento: id },
      relations: ['usuario', 'tipo_movimiento_id', 'material_id'],
    });

    if (!movimientoOriginal) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    const materialOriginal = movimientoOriginal.material_id;
    let materialNuevo = materialOriginal;
    const cantidadOriginal = movimientoOriginal.cantidad;
    const cantidadNueva = dto.cantidad ?? cantidadOriginal;
    const tipoOriginal = movimientoOriginal.tipo_movimiento_id;
    let tipoNuevo = tipoOriginal;

    if (dto.usuario_id) {
      const usuario = await this.usuarioRepo.findOneBy({ id_usuario: dto.usuario_id });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.usuario_id} no encontrado`);
      movimientoOriginal.usuario = usuario;
    }

    if (dto.tipo_movimiento) {
      const tipo = await this.tipoMovimientoRepo.findOneBy({ id_tipo_movimiento: dto.tipo_movimiento });
      if (!tipo) throw new NotFoundException(`TipoMovimiento con ID ${dto.tipo_movimiento} no encontrado`);
      tipoNuevo = tipo;
      movimientoOriginal.tipo_movimiento_id = tipo;
    }

    if (dto.material_id) {
      const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
      if (!material) throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);
      materialNuevo = material;
      movimientoOriginal.material_id = material;
    }

    if (dto.material_id || dto.tipo_movimiento || dto.cantidad) {
      await this.revertirMovimientoEnStock(materialOriginal, tipoOriginal, cantidadOriginal);
      await this.actualizarStock(materialNuevo, tipoNuevo, cantidadNueva);
    }

    Object.assign(movimientoOriginal, dto);
    return this.movimientoRepo.save(movimientoOriginal);
  }

  async remove(id: number): Promise<void> {
    const movimiento = await this.movimientoRepo.findOne({
      where: { id_movimiento: id },
      relations: ['tipo_movimiento_id', 'material_id'],
    });

    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    await this.revertirMovimientoEnStock(
      movimiento.material_id,
      movimiento.tipo_movimiento_id,
      movimiento.cantidad
    );

    const result = await this.movimientoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
  }
}
