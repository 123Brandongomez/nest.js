import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Material } from '../materiales/entities/materiale.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Sitio } from '../sitios/entities/sitio.entity';
import { TipoMovimiento } from '../tipos-movimientos/entities/tipos-movimiento.entity';
import { Sede } from '../sedes/entities/sede.entity';
import { Area } from '../areas/entities/area.entity';
import { Centro } from '../centros/entities/centro.entity';

@Injectable()
export class InformesService {
  constructor(
    @InjectRepository(Material)
    private materialesRepository: Repository<Material>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Movimiento)
    private movimientosRepository: Repository<Movimiento>,
    @InjectRepository(Sitio)
    private sitiosRepository: Repository<Sitio>,
    @InjectRepository(TipoMovimiento)
    private tiposMovimientoRepository: Repository<TipoMovimiento>,
    @InjectRepository(Sede)
    private sedesRepository: Repository<Sede>,
    @InjectRepository(Area)
    private areasRepository: Repository<Area>,
    @InjectRepository(Centro)
    private centrosRepository: Repository<Centro>,
  ) {}

  // 1. Informe de materiales asignados por usuario
  async getMaterialesPorUsuario() {
    // Usando subquery para obtener los movimientos más recientes para cada material
    const subQuery = this.movimientosRepository
      .createQueryBuilder('sub_m')
      .select('sub_m.material_id')
      .addSelect('MAX(sub_m.fecha_creacion)', 'max_fecha')
      .groupBy('sub_m.material_id');

    // Query principal
    const query = this.movimientosRepository
      .createQueryBuilder('m')
      .innerJoin('m.material_id', 'mat')
      .innerJoin('m.usuario', 'u')
      .innerJoin('m.tipo_movimiento_id', 'tm')
      .select('m.id_movimiento', 'id_movimiento')
      .addSelect('mat.id_material', 'material_id')
      .addSelect('mat.nombre_material', 'nombre_material')
      .addSelect('mat.codigo_sena', 'codigo_sena')
      .addSelect('mat.descripcion_material', 'descripcion_material')
      .addSelect('u.id_usuario', 'id_usuario')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellido', 'apellido')
      .addSelect('u.email', 'email')
      .addSelect('tm.tipo_movimiento', 'tipo_movimiento')
      .addSelect('m.fecha_creacion', 'fecha_creacion')
      .where('mat.estado = :estado', { estado: true })
      .andWhere(qb => {
        const subQueryStr = qb
          .subQuery()
          .select('MAX(m2.fecha_creacion)')
          .from(Movimiento, 'm2')
          .where('m2.material_id = m.material_id')
          .getQuery();
        return 'm.fecha_creacion = ' + subQueryStr;
      })
      .orderBy('mat.id_material')
      .addOrderBy('m.fecha_creacion', 'DESC');

    return query.getRawMany();
  }

  // 2. Inventario de materiales por sede y área
  async getInventarioPorSedeArea() {
    // Usando QueryBuilder con expresiones personalizadas para manejar la relación compleja
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('mat.sitio_id', 'sit')
      .innerJoin('areas', 'a', "sit.ubicacion LIKE CONCAT('%', a.nombre_area, '%')")
      .innerJoin('a.sede', 's')
      .innerJoin('s.centro', 'c')
      .select('c.nombre_centro', 'nombre_centro')
      .addSelect('s.nombre_sede', 'nombre_sede')
      .addSelect('a.nombre_area', 'nombre_area')
      .addSelect('COUNT(mat.id_material)', 'cantidad_materiales')
      .addSelect('SUM(mat.stock)', 'stock_total')
      .where('mat.estado = :estado', { estado: true })
      .groupBy('c.nombre_centro')
      .addGroupBy('s.nombre_sede')
      .addGroupBy('a.nombre_area')
      .orderBy('c.nombre_centro', 'ASC')
      .addOrderBy('s.nombre_sede', 'ASC')
      .addOrderBy('a.nombre_area', 'ASC');
    
    return query.getRawMany();
  }

  // 3. Movimientos históricos de materiales
  async getMovimientosHistoricos(fechaInicio?: Date, fechaFin?: Date) {
    // Usando QueryBuilder con parámetros para fechas
    const query = this.movimientosRepository
      .createQueryBuilder('m')
      .innerJoin('m.material_id', 'mat')
      .innerJoin('m.usuario', 'u')
      .innerJoin('m.tipo_movimiento_id', 'tm')
      .innerJoin('mat.sitio_id', 's')
      .select('m.id_movimiento', 'id_movimiento')
      .addSelect('mat.nombre_material', 'nombre_material')
      .addSelect('mat.codigo_sena', 'codigo_sena')
      .addSelect('u.nombre', 'nombre_usuario')
      .addSelect('u.apellido', 'apellido_usuario')
      .addSelect('tm.tipo_movimiento', 'tipo_movimiento')
      .addSelect('m.fecha_creacion', 'fecha_creacion')
      .addSelect('s.nombre_sitio', 'ubicacion');
    
    // Aplicar filtros de fecha si existen
    if (fechaInicio) {
      query.andWhere('m.fecha_creacion >= :fechaInicio', { fechaInicio });
    }
    
    if (fechaFin) {
      query.andWhere('m.fecha_creacion <= :fechaFin', { fechaFin });
    }
    
    query.orderBy('m.fecha_creacion', 'DESC');
    
    return query.getRawMany();
  }

  // 4. Materiales próximos a agotarse (stock mínimo)
  async getMaterialesStockMinimo(stockMinimo: number = 10) {
    // Usando QueryBuilder para materiales con stock bajo
    return this.materialesRepository
      .createQueryBuilder('mat')
      .leftJoinAndSelect('mat.categoria_id', 'cat')
      .leftJoinAndSelect('mat.tipo_material_id', 'tipo')
      .leftJoinAndSelect('mat.sitio_id', 'sitio')
      .where('mat.estado = :estado', { estado: true })
      .andWhere('mat.stock <= :stockMinimo', { stockMinimo })
      .orderBy('mat.stock', 'ASC')
      .getMany();
  }

  // 5. Materiales más utilizados o solicitados
  async getMaterialesMasUtilizados(limite: number = 10) {
    // Usando QueryBuilder para contar movimientos por material
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('movimientos', 'm', 'm.material_id = mat.id_material')
      .select('mat.id_material', 'id_material')
      .addSelect('mat.nombre_material', 'nombre_material')
      .addSelect('mat.codigo_sena', 'codigo_sena')
      .addSelect('COUNT(m.id_movimiento)', 'total_movimientos')
      .where('mat.estado = :estado', { estado: true })
      .groupBy('mat.id_material')
      .addGroupBy('mat.nombre_material')
      .addGroupBy('mat.codigo_sena')
      .orderBy('total_movimientos', 'DESC')
      .limit(limite);

    return query.getRawMany();
  }

  // 6. Usuarios con mayor cantidad de materiales asignados
  async getUsuariosConMasMateriales(limite: number = 10) {
    // Primero creamos una subconsulta para obtener los últimos movimientos de cada material
    const subQuery = this.movimientosRepository
      .createQueryBuilder('subm')
      .select('subm.material_id', 'material_id')
      .addSelect('MAX(subm.fecha_creacion)', 'max_fecha')
      .innerJoin('subm.material_id', 'submat')
      .where('submat.estado = :estado', { estado: true })
      .groupBy('subm.material_id');

    // Ahora obtenemos los usuarios con más materiales asignados
    const query = this.usuariosRepository
      .createQueryBuilder('u')
      .innerJoin('u.movimientos', 'm')
      .innerJoin('m.material_id', 'mat')
      .innerJoin(
        `(${subQuery.getQuery()})`, 
        'um', 
        'um.material_id = mat.id_material AND m.fecha_creacion = um.max_fecha'
      )
      .select('u.id_usuario', 'id_usuario')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellido', 'apellido')
      .addSelect('u.email', 'email')
      .addSelect('COUNT(mat.id_material)', 'total_materiales')
      .setParameters(subQuery.getParameters())
      .groupBy('u.id_usuario')
      .addGroupBy('u.nombre')
      .addGroupBy('u.apellido')
      .addGroupBy('u.email')
      .orderBy('total_materiales', 'DESC')
      .limit(limite);

    return query.getRawMany();
  }

  // 7. Estado general del inventario
  async getEstadoInventario() {
    // Usando QueryBuilder para agrupar por tipo de material
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('mat.tipo_material_id', 'tm')
      .select('tm.tipo_elemento', 'categoria')
      .addSelect('COUNT(mat.id_material)', 'cantidad')
      .addSelect('SUM(mat.stock)', 'stock_total')
      .where('mat.estado = :estado', { estado: true })
      .groupBy('tm.tipo_elemento')
      .orderBy('stock_total', 'DESC');

    return query.getRawMany();
  }

  // 8. Transferencias entre sedes o áreas
  async getTransferenciasSedes(fechaInicio?: Date, fechaFin?: Date) {
    try {
      // Usando QueryBuilder para transferencias entre sedes
      const query = this.movimientosRepository
        .createQueryBuilder('m')
        .innerJoin('m.material_id', 'mat')
        .innerJoin('m.usuario', 'u')
        .innerJoin('m.tipo_movimiento_id', 'tm')
        .select('m.id_movimiento', 'id_movimiento')
        .addSelect('mat.nombre_material', 'nombre_material')
        .addSelect('mat.codigo_sena', 'codigo_sena')
        .addSelect('u.nombre', 'nombre_usuario')
        .addSelect('u.apellido', 'apellido_usuario')
        .addSelect('tm.tipo_movimiento', 'tipo_movimiento')
        .addSelect('m.fecha_creacion', 'fecha_creacion')
        .where('tm.tipo_movimiento LIKE :tipoMovimiento', { tipoMovimiento: '%transferencia%' });
      
      // Aplicar filtros de fecha si existen
      if (fechaInicio) {
        query.andWhere('m.fecha_creacion >= :fechaInicio', { fechaInicio });
      }
      
      if (fechaFin) {
        query.andWhere('m.fecha_creacion <= :fechaFin', { fechaFin });
      }
      
      query.orderBy('m.fecha_creacion', 'DESC');
      
      return query.getRawMany();
    } catch (error) {
      console.error('Error en getTransferenciasSedes:', error);
      throw new Error('Error al obtener transferencias entre sedes');
    }
  }

  // 9. Historial de uso de materiales por usuario
  async getHistorialPorUsuarioGeneral(fechaInicio?: Date, fechaFin?: Date, usuarioId?: number) {
    // Usando QueryBuilder para historial por usuario
    const query = this.usuariosRepository
      .createQueryBuilder('u')
      .innerJoin('u.movimientos', 'm')
      .select('u.id_usuario', 'id_usuario')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellido', 'apellido')
      .addSelect('COUNT(m.id_movimiento)', 'total_movimientos')
      .addSelect('COUNT(DISTINCT m.material_id)', 'total_materiales_distintos');
    
    // Aplicar filtros si existen
    if (fechaInicio) {
      query.andWhere('m.fecha_creacion >= :fechaInicio', { fechaInicio });
    }
    
    if (fechaFin) {
      query.andWhere('m.fecha_creacion <= :fechaFin', { fechaFin });
    }
    
    if (usuarioId) {
      query.andWhere('u.id_usuario = :usuarioId', { usuarioId });
    }
    
    query
      .groupBy('u.id_usuario')
      .addGroupBy('u.nombre')
      .addGroupBy('u.apellido')
      .orderBy('total_movimientos', 'DESC');
    
    return query.getRawMany();
  }

  // Historial por usuario específico
  async getHistorialPorUsuario(id: number) {
    // Usando QueryBuilder para historial de un usuario específico
    const query = this.movimientosRepository
      .createQueryBuilder('m')
      .innerJoin('m.material_id', 'mat')
      .innerJoin('m.tipo_movimiento_id', 'tm')
      .innerJoin('mat.sitio_id', 's')
      .innerJoin('m.usuario', 'u')
      .select('m.id_movimiento', 'id_movimiento')
      .addSelect('mat.nombre_material', 'nombre_material')
      .addSelect('mat.codigo_sena', 'codigo_sena')
      .addSelect('tm.tipo_movimiento', 'tipo_movimiento')
      .addSelect('m.fecha_creacion', 'fecha_creacion')
      .addSelect('s.nombre_sitio', 'ubicacion')
      .where('u.id_usuario = :id', { id })
      .orderBy('m.fecha_creacion', 'DESC');
    
    return query.getRawMany();
  }

  // 10. Materiales dados de baja o fuera de servicio
  async getMaterialesBaja() {
    // Usando QueryBuilder para materiales dados de baja
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('mat.tipo_material_id', 'tm')
      .innerJoin('mat.categoria_id', 'cat')
      .innerJoin('mat.sitio_id', 's')
      .select('mat.id_material', 'id_material')
      .addSelect('mat.nombre_material', 'nombre_material')
      .addSelect('mat.codigo_sena', 'codigo_sena')
      .addSelect('mat.descripcion_material', 'descripcion_material')
      .addSelect('tm.tipo_elemento', 'tipo_material')
      .addSelect('cat.nombre_categoria', 'categoria')
      .addSelect('s.nombre_sitio', 'ubicacion')
      .addSelect('mat.fecha_modificacion', 'fecha_actualizacion')
      .where('mat.estado = :estado', { estado: false })
      .orderBy('mat.fecha_modificacion', 'DESC');
    
    return query.getRawMany();
  }

  // 11. Materiales por categoría
  async getMaterialesPorCategoria() {
    // Usando QueryBuilder para agrupar por categoría
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('mat.categoria_id', 'cat')
      .select('cat.nombre_categoria', 'categoria')
      .addSelect('COUNT(mat.id_material)', 'cantidad_materiales')
      .addSelect('SUM(mat.stock)', 'stock_total')
      .where('mat.estado = :estado', { estado: true })
      .groupBy('cat.nombre_categoria')
      .orderBy('stock_total', 'DESC');
    
    return query.getRawMany();
  }

  // 12. Materiales por sitio
  async getMaterialesPorSitio() {
    // Usando QueryBuilder para agrupar por sitio
    const query = this.materialesRepository
      .createQueryBuilder('mat')
      .innerJoin('mat.sitio_id', 's')
      .select('s.nombre_sitio', 'nombre_sitio')
      .addSelect('COUNT(mat.id_material)', 'cantidad_materiales')
      .addSelect('SUM(mat.stock)', 'stock_total')
      .where('mat.estado = :estado', { estado: true })
      .groupBy('s.nombre_sitio')
      .orderBy('stock_total', 'DESC');
    
    return query.getRawMany();
  }
}
