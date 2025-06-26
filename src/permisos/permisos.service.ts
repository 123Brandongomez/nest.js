import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Modulo } from '../modulos/entities/modulo.entity';
import { Rol } from 'src/roles/entities/role.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    const { rol_id, modulo_id, ...resto } = createPermisoDto;

    const rol = await this.rolRepository.findOneBy({ id_rol: rol_id });
    if (!rol) throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);

    const modulo = await this.moduloRepository.findOneBy({ id_modulo: modulo_id });
    if (!modulo) throw new NotFoundException(`Módulo con ID ${modulo_id} no encontrado`);

    const permiso = this.permisoRepository.create({
      ...resto,
      rol_id: rol,
      modulo_id: modulo,
    });

    return this.permisoRepository.save(permiso);
  }

  async findAll(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      relations: ['modulo_id', 'rol_id'],
    });
  }

  async findOne(id: number): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { id_permiso: id },
      relations: ['modulo_id', 'rol_id'],
    });

    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    return permiso;
  }

  async update(id: number, updatePermisoDto: UpdatePermisoDto): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOneBy({ id_permiso: id });
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }

    // Actualizar relaciones si vienen en el DTO
    if (updatePermisoDto.modulo_id) {
      const modulo = await this.moduloRepository.findOneBy({ id_modulo: updatePermisoDto.modulo_id });
      if (!modulo) throw new NotFoundException(`Módulo con ID ${updatePermisoDto.modulo_id} no encontrado`);
      permiso.modulo_id = modulo;
    }

    if (updatePermisoDto.rol_id) {
      const rol = await this.rolRepository.findOneBy({ id_rol: updatePermisoDto.rol_id });
      if (!rol) throw new NotFoundException(`Rol con ID ${updatePermisoDto.rol_id} no encontrado`);
      permiso.rol_id = rol;
    }

    // Actualizar campos simples
    permiso.nombre = updatePermisoDto.nombre ?? permiso.nombre;
    permiso.codigo_nombre = updatePermisoDto.codigo_nombre ?? permiso.codigo_nombre;
    permiso.puede_ver = updatePermisoDto.puede_ver ?? permiso.puede_ver;
    permiso.puede_crear = updatePermisoDto.puede_crear ?? permiso.puede_crear;
    permiso.puede_actualizar = updatePermisoDto.puede_actualizar ?? permiso.puede_actualizar;
    permiso.estado = updatePermisoDto.estado ?? permiso.estado;

    return this.permisoRepository.save(permiso);
  }

  async remove(id: number): Promise<void> {
    const result = await this.permisoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  }

  // Métodos para el super administrador
  
  /**
   * Verifica si un usuario es super administrador o administrador con permisos para gestionar permisos
   */
  async isSuperAdmin(usuarioId: number): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: usuarioId },
      relations: ['rol'],
    });
    
    console.log('isSuperAdmin - Usuario encontrado:', {
      id: usuario?.id_usuario,
      email: usuario?.email,
      rol: usuario?.rol?.nombre_rol,
      rol_id: usuario?.rol?.id_rol
    });
    
    if (!usuario || !usuario.rol) {
      console.log('isSuperAdmin - Usuario sin rol asignado');
      return false;
    }
    
    // Permitir tanto al Super Administrador como al Administrador normal gestionar permisos
    const esSuperAdmin = usuario.rol.nombre_rol.toLowerCase() === 'super administrador';
    const esAdmin = usuario.rol.nombre_rol === 'Administrador';
    
    console.log(`isSuperAdmin - Es super admin: ${esSuperAdmin}, Es admin: ${esAdmin}`);
    
    return esSuperAdmin || esAdmin;
  }
  
  /**
   * Asigna o actualiza permisos para un rol y módulo específicos
   * Utiliza directamente la tabla de permisos existente
   */
  async asignarPermiso(
    usuarioId: number,
    createPermisoDto: CreatePermisoDto
  ): Promise<Permiso> {
    // Verificar si el usuario es super administrador
    const esSuperAdmin = await this.isSuperAdmin(usuarioId);
    if (!esSuperAdmin) {
      throw new ForbiddenException('Solo el super administrador puede asignar permisos');
    }
    
    const { rol_id, modulo_id, ...datosPermiso } = createPermisoDto;
    
    // Buscar el rol y el módulo
    const rol = await this.rolRepository.findOneBy({ id_rol: rol_id });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);
    }
    
    const modulo = await this.moduloRepository.findOneBy({ id_modulo: modulo_id });
    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${modulo_id} no encontrado`);
    }
    
    // Verificar si ya existe un permiso para este rol y módulo
    let permiso = await this.permisoRepository.findOne({
      where: {
        rol_id: { id_rol: rol_id },
        modulo_id: { id_modulo: modulo_id },
      },
    });
    
    if (permiso) {
      // Actualizar el permiso existente
      permiso.puede_ver = datosPermiso.puede_ver ?? permiso.puede_ver;
      permiso.puede_crear = datosPermiso.puede_crear ?? permiso.puede_crear;
      permiso.puede_actualizar = datosPermiso.puede_actualizar ?? permiso.puede_actualizar;
      permiso.estado = datosPermiso.estado ?? permiso.estado;
    } else {
      // Crear un nuevo permiso
      permiso = this.permisoRepository.create({
        nombre: datosPermiso.nombre || `Permiso ${modulo.descripcion_ruta} para ${rol.nombre_rol}`,
        codigo_nombre: datosPermiso.codigo_nombre || `${modulo.rutas}_${rol.nombre_rol}`.toLowerCase().replace(/\s+/g, '_'),
        rol_id: rol,
        modulo_id: modulo,
        puede_ver: datosPermiso.puede_ver ?? false,
        puede_crear: datosPermiso.puede_crear ?? false,
        puede_actualizar: datosPermiso.puede_actualizar ?? false,
        estado: datosPermiso.estado ?? true,
      });
    }
    
    return this.permisoRepository.save(permiso);
  }
  
  /**
   * Método simplificado para asignar permisos a una tabla/módulo específico
   * Este método es utilizado por el super administrador para gestionar permisos por tabla
   */
  async asignarPermisoTabla(asignarPermisosDto: any): Promise<Permiso> {
    const { rol_id, modulo_id, puede_ver, puede_crear, puede_actualizar, estado } = asignarPermisosDto;
    
    // Buscar el rol y el módulo
    const rol = await this.rolRepository.findOneBy({ id_rol: rol_id });
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);
    }
    
    const modulo = await this.moduloRepository.findOneBy({ id_modulo: modulo_id });
    if (!modulo) {
      throw new NotFoundException(`Módulo con ID ${modulo_id} no encontrado`);
    }
    
    // Verificar si ya existe un permiso para este rol y módulo
    let permiso = await this.permisoRepository.findOne({
      where: {
        rol_id: { id_rol: rol_id },
        modulo_id: { id_modulo: modulo_id },
      },
    });
    
    if (permiso) {
      // Actualizar el permiso existente
      if (puede_ver !== undefined) permiso.puede_ver = puede_ver;
      if (puede_crear !== undefined) permiso.puede_crear = puede_crear;
      if (puede_actualizar !== undefined) permiso.puede_actualizar = puede_actualizar;
      if (estado !== undefined) permiso.estado = estado;
    } else {
      // Crear un nuevo permiso
      permiso = this.permisoRepository.create({
        nombre: `Permiso ${modulo.descripcion_ruta} para ${rol.nombre_rol}`,
        codigo_nombre: `${modulo.rutas}_${rol.nombre_rol}`.toLowerCase().replace(/\s+/g, '_'),
        rol_id: rol,
        modulo_id: modulo,
        puede_ver: puede_ver ?? false,
        puede_crear: puede_crear ?? false,
        puede_actualizar: puede_actualizar ?? false,
        estado: estado ?? true,
      });
    }
    
    return this.permisoRepository.save(permiso);
  }
  
  /**
   * Obtiene todos los permisos de un rol específico
   */
  async getPermisosByRol(rolId: number): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: {
        rol_id: { id_rol: rolId },
      },
      relations: ['modulo_id', 'rol_id'],
    });
  }
  
  /**
   * Obtiene todos los permisos para un módulo específico
   */
  async getPermisosByModulo(moduloId: number): Promise<Permiso[]> {
    return this.permisoRepository.find({
      where: {
        modulo_id: { id_modulo: moduloId },
      },
      relations: ['modulo_id', 'rol_id'],
    });
  }
  
  /**
   * Verifica si un usuario tiene un permiso específico para un módulo y acción
   * basado en su token JWT
   */
  async verificarPermiso(usuarioId: number, moduloNombre: string, accion: string): Promise<boolean> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: usuarioId },
      relations: ['rol'],
    });
    
    if (!usuario || !usuario.rol) {
      return false;
    }
    
    // Si es super administrador, tiene todos los permisos
    if (usuario.rol.nombre_rol === 'Super Administrador') {
      return true;
    }
    
    const modulo = await this.moduloRepository.findOne({
      where: { rutas: moduloNombre },
    });
    
    if (!modulo) {
      return false;
    }
    
    const permisos = await this.permisoRepository.find({
      where: {
        rol_id: { id_rol: usuario.rol.id_rol },
        modulo_id: { id_modulo: modulo.id_modulo },
      },
    });
    
    if (permisos.length === 0) {
      return false;
    }
    
    // Verificar si alguno de los permisos permite la acción
    for (const permiso of permisos) {
      switch (accion) {
        case 'ver':
          if (permiso.puede_ver === true) return true;
          break;
        case 'crear':
          if (permiso.puede_crear === true) return true;
          break;
        case 'actualizar':
          if (permiso.puede_actualizar === true) return true;
          break;
      }
    }
    
    return false;
  }
  
  /**
   * Obtiene todos los módulos/tablas con sus permisos para un rol específico
   * Útil para mostrar en la interfaz de administración de permisos
   */
  async getTablasConPermisos(rolId: number): Promise<any[]> {
    // Obtener todos los módulos
    const modulos = await this.moduloRepository.find();
    
    // Obtener todos los permisos para el rol especificado
    const permisos = await this.permisoRepository.find({
      where: {
        rol_id: { id_rol: rolId },
      },
      relations: ['modulo_id'],
    });
    
    // Crear un mapa de permisos por módulo para acceso rápido
    const permisosPorModulo = {};
    permisos.forEach(permiso => {
      if (permiso.modulo_id && permiso.modulo_id.id_modulo) {
        permisosPorModulo[permiso.modulo_id.id_modulo] = permiso;
      }
    });
    
    // Construir la respuesta con todos los módulos y sus permisos
    return modulos.map(modulo => {
      const permiso = permisosPorModulo[modulo.id_modulo] || null;
      
      return {
        id_modulo: modulo.id_modulo,
        nombre: modulo.descripcion_ruta || modulo.rutas,
        ruta: modulo.rutas,
        permisos: permiso ? {
          id_permiso: permiso.id_permiso,
          puede_ver: permiso.puede_ver,
          puede_crear: permiso.puede_crear,
          puede_actualizar: permiso.puede_actualizar,
          estado: permiso.estado,
        } : {
          puede_ver: false,
          puede_crear: false,
          puede_actualizar: false,
          estado: false,
        }
      };
    });
  }
}
