import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Permiso } from '../../permisos/entities/permiso.entity';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn()
  id_modulo: number;

  @Column('text')
  rutas: string;

  @Column({ length: 200 })
  descripcion_ruta: string;

  @Column('text')
  mensaje_cambio: string;

  @Column('text', { nullable: true })
  imagen: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;
  
  @Column({ type: 'boolean', default: false })
  es_submenu: boolean;

  @Column({ nullable: true })
  modulo_padre_id: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @CreateDateColumn()
  fecha_accion: Date;

  @ManyToOne(() => Modulo, modulo => modulo.submodulos, { nullable: true })
  @JoinColumn({ name: 'modulo_padre_id' })
  modulo_padre: Modulo;

  @OneToMany(() => Modulo, modulo => modulo.modulo_padre)
  submodulos: Modulo[];
  
  @OneToMany(() => Permiso, permiso => permiso.modulo_id)
  permisos: Permiso[];
}
