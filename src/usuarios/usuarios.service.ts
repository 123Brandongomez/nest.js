import { Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Rol } from 'src/roles/entities/role.entity';
import { CustomIdCrudService } from '../common/services/custom-id-crud.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class UsuariosService extends CustomIdCrudService<Usuario, CreateUsuarioDto, UpdateUsuarioDto> {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {
    // Llamar al constructor de la clase base con el repositorio y el nombre del campo ID
    super(usuarioRepo, 'id_usuario');
  }

  /**
   * Sobreescribe el método create de la clase base para manejar la encriptación de contraseña y relación con roles
   * @param dto DTO con los datos para crear el usuario
   * @returns Usuario creado
   */
  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    // Validar que el rol exista
    const rol = await this.rolRepo.findOneBy({ id_rol: dto.rol_id });
    if (!rol) throw new NotFoundException(`Rol con ID ${dto.rol_id} no encontrado`);

    // Encriptar la contraseña antes de guardar
    let hashedPassword = dto.contrasena;
    if (dto.contrasena) {
      hashedPassword = crypto.createHash('sha256').update(dto.contrasena).digest('hex');
    }

    // Crear un objeto con los datos del DTO, excluyendo rol_id
    const { rol_id, ...userData } = dto;

    // Crear el nuevo usuario con los datos y la relación con el rol
    const nuevoUsuario = this.usuarioRepo.create({
      ...userData,
      contrasena: hashedPassword,
      rol: rol // Asignar el objeto rol completo, no solo el ID
    });
    
    // Guardar y devolver el usuario creado
    return this.usuarioRepo.save(nuevoUsuario) as unknown as Usuario;
  }

  /**
   * Sobreescribe el método findAll de la clase base para incluir relaciones por defecto
   * @param paginationQuery Parámetros de paginación (opcional)
   * @returns Respuesta paginada con los usuarios
   */
  async findAll(paginationQuery?: PaginationQueryDto): Promise<PaginationDto<Usuario>> {
    // Llamar al método de la clase base con las relaciones que queremos cargar
    return super.findAll(paginationQuery, ['rol']);
  }

  /**
   * Sobreescribe el método findOne de la clase base para incluir relaciones por defecto
   * @param id ID del usuario a buscar
   * @returns Usuario encontrado
   */
  async findOne(id: number | string): Promise<Usuario> {
    // Llamar al método de la clase base con las relaciones que queremos cargar
    return super.findOne(id, ['rol']);
  }

  /**
   * Sobreescribe el método update de la clase base para manejar la encriptación de contraseña y relación con roles
   * @param id ID del usuario a actualizar
   * @param dto DTO con los datos para actualizar
   * @returns Usuario actualizado
   */
  async update(id: number | string, dto: UpdateUsuarioDto): Promise<Usuario> {
    // Obtener el usuario que se va a actualizar
    const usuario = await this.findOne(id);

    // Separar rol_id del resto de los datos para evitar conflictos
    const { rol_id, ...updateData } = dto;

    // Actualizar la relación con el rol si se proporciona
    if (rol_id) {
      const rol = await this.rolRepo.findOneBy({ id_rol: rol_id });
      if (!rol) throw new NotFoundException(`Rol con ID ${rol_id} no encontrado`);
      usuario.rol = rol;
    }

    // Encriptar la contraseña si se proporciona una nueva
    if (updateData.contrasena) {
      updateData.contrasena = crypto.createHash('sha256').update(updateData.contrasena).digest('hex');
    }

    // Aplicar los cambios al usuario
    Object.assign(usuario, updateData);
    
    // Guardar y devolver el usuario actualizado
    return this.usuarioRepo.save(usuario) as unknown as Usuario;
  }

  /**
   * Sobreescribe el método remove de la clase base para realizar una eliminación lógica
   * @param id ID del usuario a eliminar
   * @returns true si el usuario fue desactivado correctamente
   */
  async remove(id: number | string): Promise<boolean> {
    // Utilizamos el mu00e9todo softDelete de la clase base que ya implementa la eliminaciu00f3n lu00f3gica
    await this.softDelete(id);
    return true;
  }
}
