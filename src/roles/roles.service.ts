import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Rol> {
    const rol = this.rolRepository.create(createRoleDto);
    return this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async findOne(id: number): Promise<Rol> {
    const rol = await this.rolRepository.findOneBy({ id_rol: id});
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
    return rol;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    const rol = await this.findOne(id);
    Object.assign(rol, updateRoleDto);
    return this.rolRepository.save(rol);
  }

  async remove(id: number): Promise<void> {
    const result = await this.rolRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  }
}
