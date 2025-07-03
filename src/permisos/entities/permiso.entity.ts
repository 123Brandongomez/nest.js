import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/role.entity';
import { Modulo } from '../../modulos/entities/modulo.entity';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn()
  id_permiso: number;

  @Column({ nullable: true })
  nombre: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'boolean', nullable: true })
  puede_ver: boolean;

  @Column({ type: 'boolean', nullable: true })
  puede_crear: boolean;

  @Column({ type: 'boolean', nullable: true })
  puede_actualizar: boolean;

  @Column({ type: 'boolean', nullable: true })
  puede_eliminar: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Modulo, modulo => modulo.permisos)
  @JoinColumn({ name: 'modulo_id' })
  modulo_id: Modulo;

  @ManyToOne(() => Rol, rol => rol.permisos)
  @JoinColumn({ name: 'rol_id' })
  rol_id: Rol;
}
