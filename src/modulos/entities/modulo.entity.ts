import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn()
  id_modulo: number;

  @CreateDateColumn()
  fecha_accion: Date;

  @Column('text')
  rutas: string;

  @Column({ length: 200 })
  descripcion_ruta: string;

  @Column('text')
  mensaje_cambio: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;
  
  @OneToMany(() => Permiso, permiso => permiso.modulo_id)
  permisos: Permiso[];
}
