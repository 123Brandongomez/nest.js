import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
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
    const rol = await this.rolRepo.findOneBy({ id_rol: dto.rol_id });
    if (!rol) throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);

    // Encriptar la contraseña antes de guardar
    let hashedPassword = dto.contrasena;
    if (dto.contrasena) {
      hashedPassword = await bcrypt.hash(dto.contrasena, 10);
    }

    const nuevoUsuario = this.usuarioRepo.create({ ...dto, contrasena: hashedPassword, rol });
    return this.usuarioRepo.save(nuevoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findOne({
      where: { id_usuario: id },
      relations: ['rol'],
    });
    if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (dto.rol_id) {
      const rol = await this.rolRepo.findOneBy({ id_rol: dto.rol_id });
      if (!rol) throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);
      usuario.rol = rol;
    }

    // Encriptar la contraseña si se proporciona una nueva
    if (dto.contrasena) {
      dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
    }

    Object.assign(usuario, dto);
    return this.usuarioRepo.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}
