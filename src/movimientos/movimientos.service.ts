import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { TipoMovimiento } from 'src/tipos-movimientos/entities/tipos-movimiento.entity';
import { Material } from '../materiales/entities/materiale.entity';

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
  ) {}

  async create(dto: CreateMovimientoDto): Promise<Movimiento> {
    // Validar usuario
    const usuario = await this.usuarioRepo.findOneBy({ id_usuario: dto.usuario_id });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.usuario_id} no encontrado`);

    // Validar tipo de movimiento
    const tipo = await this.tipoMovimientoRepo.findOneBy({ id_tipo_movimiento: dto.tipo_movimiento });
    if (!tipo) throw new NotFoundException(`TipoMovimiento con ID ${dto.tipo_movimiento} no encontrado`);

    // Validar material
    const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
    if (!material) throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);

    // Validar cantidad
    if (dto.cantidad <= 0) {
      throw new BadRequestException('La cantidad debe ser mayor que cero');
    }

    // Actualizar stock según el tipo de movimiento
    // Asumiendo que tipos de movimiento con nombres que contienen 'entrada', 'ingreso' o 'adición' son entradas
    // y los que contienen 'salida', 'egreso' o 'retiro' son salidas
    const tipoNombre = tipo.tipo_movimiento.toLowerCase();
    const esEntrada = tipoNombre.includes('entrada') || tipoNombre.includes('ingreso') || tipoNombre.includes('adicion');
    const esSalida = tipoNombre.includes('salida') || tipoNombre.includes('egreso') || tipoNombre.includes('retiro');

    if (esEntrada) {
      // Incrementar stock
      material.stock += dto.cantidad;
    } else if (esSalida) {
      // Validar que haya suficiente stock
      if (material.stock < dto.cantidad) {
        throw new BadRequestException(`Stock insuficiente. Stock actual: ${material.stock}, Cantidad solicitada: ${dto.cantidad}`);
      }
      // Decrementar stock
      material.stock -= dto.cantidad;
    } else {
      // Si no es entrada ni salida, lanzar error
      throw new BadRequestException(`Tipo de movimiento no reconocido: ${tipo.tipo_movimiento}`);
    }

    // Guardar el material actualizado
    await this.materialRepo.save(material);

    // Crear y guardar el movimiento
    const nuevo = this.movimientoRepo.create();
    nuevo.estado = dto.estado;
    nuevo.usuario = usuario;
    nuevo.tipo_movimiento_id = tipo;
    nuevo.material_id = material;
    nuevo.cantidad = dto.cantidad; // Guardar la cantidad en la entidad

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
    // Obtener el movimiento original con todas sus relaciones
    const movimientoOriginal = await this.movimientoRepo.findOne({
      where: { id_movimiento: id },
      relations: ['usuario', 'tipo_movimiento_id', 'material_id'],
    });
    
    if (!movimientoOriginal) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }

    // Variables para controlar los cambios en el stock
    let materialOriginal = movimientoOriginal.material_id;
    let materialNuevo = materialOriginal;
    let cantidadOriginal = movimientoOriginal.cantidad; // Usar la cantidad almacenada en la entidad
    let cantidadNueva = dto.cantidad || cantidadOriginal; // Si no se proporciona una nueva cantidad, usar la original
    let tipoOriginal = movimientoOriginal.tipo_movimiento_id;
    let tipoNuevo = tipoOriginal;

    // Actualizar usuario si es necesario
    if (dto.usuario_id) {
      const usuario = await this.usuarioRepo.findOneBy({ id_usuario: dto.usuario_id });
      if (!usuario) throw new NotFoundException(`Usuario con ID ${dto.usuario_id} no encontrado`);
      movimientoOriginal.usuario = usuario;
    }

    // Actualizar tipo de movimiento si es necesario
    if (dto.tipo_movimiento) {
      const tipo = await this.tipoMovimientoRepo.findOneBy({ id_tipo_movimiento: dto.tipo_movimiento });
      if (!tipo) throw new NotFoundException(`TipoMovimiento con ID ${dto.tipo_movimiento} no encontrado`);
      tipoNuevo = tipo;
      movimientoOriginal.tipo_movimiento_id = tipo;
    }

    // Actualizar material si es necesario
    if (dto.material_id) {
      const material = await this.materialRepo.findOneBy({ id_material: dto.material_id });
      if (!material) throw new NotFoundException(`Material con ID ${dto.material_id} no encontrado`);
      materialNuevo = material;
      movimientoOriginal.material_id = material;
    }

    // Si hay cambios en el material, tipo o cantidad, actualizar el stock
    if (dto.material_id || dto.tipo_movimiento || dto.cantidad) {
      // Revertir el efecto del movimiento original en el stock
      const tipoOriginalNombre = tipoOriginal.tipo_movimiento.toLowerCase();
      const esEntradaOriginal = tipoOriginalNombre.includes('entrada') || tipoOriginalNombre.includes('ingreso') || tipoOriginalNombre.includes('adicion');
      const esSalidaOriginal = tipoOriginalNombre.includes('salida') || tipoOriginalNombre.includes('egreso') || tipoOriginalNombre.includes('retiro');

      // Revertir el efecto del movimiento original
      if (materialOriginal && (esEntradaOriginal || esSalidaOriginal)) {
        if (esEntradaOriginal) {
          materialOriginal.stock -= cantidadOriginal; // Revertir entrada usando la cantidad original
        } else if (esSalidaOriginal) {
          materialOriginal.stock += cantidadOriginal; // Revertir salida usando la cantidad original
        }
        
        // Guardar el material original con el stock revertido
        await this.materialRepo.save(materialOriginal);
      }

      // Aplicar el efecto del nuevo movimiento
      const tipoNuevoNombre = tipoNuevo.tipo_movimiento.toLowerCase();
      const esEntradaNuevo = tipoNuevoNombre.includes('entrada') || tipoNuevoNombre.includes('ingreso') || tipoNuevoNombre.includes('adicion');
      const esSalidaNuevo = tipoNuevoNombre.includes('salida') || tipoNuevoNombre.includes('egreso') || tipoNuevoNombre.includes('retiro');

      if (materialNuevo && (esEntradaNuevo || esSalidaNuevo)) {
        if (esEntradaNuevo) {
          materialNuevo.stock += cantidadNueva; // Aplicar nueva entrada
        } else if (esSalidaNuevo) {
          // Verificar que haya suficiente stock
          if (materialNuevo.stock < cantidadNueva) {
            throw new BadRequestException(`Stock insuficiente. Stock actual: ${materialNuevo.stock}, Cantidad solicitada: ${cantidadNueva}`);
          }
          materialNuevo.stock -= cantidadNueva; // Aplicar nueva salida
        }
        
        // Guardar el material nuevo con el stock actualizado
        await this.materialRepo.save(materialNuevo);
      }
    }

    // Actualizar los demás campos del movimiento
    Object.assign(movimientoOriginal, dto);
    return this.movimientoRepo.save(movimientoOriginal);
  }

  async remove(id: number): Promise<void> {
    const result = await this.movimientoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
  }
}
