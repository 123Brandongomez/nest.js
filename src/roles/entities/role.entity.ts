import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id_rol: number;

  @Column({ length: 100 })
  nombre_rol: string;

  @Column('text')
  descripcion: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Usuario, usuario => usuario.rol)
  usuarios: Usuario[];

  @OneToMany(() => Permiso, permiso => permiso.rol_id)
  permisos: Permiso[];
}
