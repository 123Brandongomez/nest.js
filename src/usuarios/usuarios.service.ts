import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Rol } from 'src/roles/entities/role.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,

    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const rolId = Array.isArray(dto.rol_id) ? dto.rol_id[0] : dto.rol_id;
    const rol = await this.rolRepo.findOneBy({ id_rol: rolId });
    if (!rol) throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);

    let hashedPassword = dto.contrasena;
    if (dto.contrasena) {
      hashedPassword = crypto.createHash('sha256').update(dto.contrasena).digest('hex');
    }

    const { rol_id, ...userData } = dto;

    const nuevoUsuario = this.usuarioRepo.create({
      ...userData,
      contrasena: hashedPassword,
      rol: rol,
    });

    return this.usuarioRepo.save(nuevoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({
      relations: ['rol'],
    });
  }

  async findOne(id: number | string): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: Number(id) },
      relations: ['rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number | string, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    const { rol_id, ...updateData } = dto;

    if (rol_id) {
      const rolId = Array.isArray(rol_id) ? rol_id[0] : rol_id;
      const rol = await this.rolRepo.findOneBy({ id_rol: rolId });
      if (!rol) throw new NotFoundException(`Rol con ID ${rolId} no encontrado`);
      usuario.rol = rol;
    }

    if (updateData.contrasena) {
      updateData.contrasena = crypto.createHash('sha256').update(updateData.contrasena).digest('hex');
    }

    Object.assign(usuario, updateData);

    return this.usuarioRepo.save(usuario);
  }

  async remove(id: number | string): Promise<boolean> {
    const usuario = await this.findOne(id);
    await this.usuarioRepo.save(usuario);
    return true;
  }
}
