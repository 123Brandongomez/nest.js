import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './entities/permiso.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { Modulo } from '../modulos/entities/modulo.entity';
import { Rol } from 'src/roles/entities/role.entity';

@Injectable()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createPermisoDto: CreatePermisoDto): Promise<Permiso> {
    const modulo = await this.moduloRepository.findOneBy({ id_modulo: Number(createPermisoDto.modulo) });
    const rol = await this.rolRepository.findOneBy({ id_rol:Number( createPermisoDto.rol )});

    if (!modulo) {
      throw new NotFoundException(`Modulo con ID ${createPermisoDto.modulo} no encontrado`);
    }

    if (!rol) {
      throw new NotFoundException(`Rol con ID ${createPermisoDto.rol} no encontrado`);
    }

    const permiso = this.permisoRepository.create({
      nombre: createPermisoDto.nombre,
      codigo_nombre: createPermisoDto.codigo_nombre,
      modulo_id: modulo,
      rol_id: rol,
    });

    return this.permisoRepository.save(permiso);
  }

  async findAll(): Promise<Permiso[]> {
    return this.permisoRepository.find({
      relations: ['modulo', 'rol'],
    });
  }

  async findOne(id: number): Promise<Permiso> {
    const permiso = await this.permisoRepository.findOne({
      where: { id_permiso: id },
      relations: ['modulo', 'rol'],
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

    if (updatePermisoDto.modulo) {
      const modulo = await this.moduloRepository.findOneBy({ id_modulo: Number(updatePermisoDto.modulo )});
      if (!modulo) throw new NotFoundException(`Modulo con ID ${updatePermisoDto.modulo} no encontrado`);
      permiso.modulo_id = modulo;
    }

    if (updatePermisoDto.rol) {
      const rol = await this.rolRepository.findOneBy({ id_rol:Number( updatePermisoDto.rol) });
      if (!rol) throw new NotFoundException(`Rol con ID ${updatePermisoDto.rol} no encontrado`);
      permiso.rol_id = rol;
    }

    permiso.nombre = updatePermisoDto.nombre ?? permiso.nombre;
    permiso.codigo_nombre = updatePermisoDto.codigo_nombre ?? permiso.codigo_nombre;

    return this.permisoRepository.save(permiso);
  }

  async remove(id: number): Promise<void> {
    const result = await this.permisoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  }
}
