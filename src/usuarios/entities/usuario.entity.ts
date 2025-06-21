import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Rol } from '../../roles/entities/role.entity';
import { Movimiento } from '../../movimientos/entities/movimiento.entity';
import { Ficha } from '../../fichas/entities/ficha.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 150 })
  apellido: string;

  @Column()
  edad: number;

  @Column({ length: 60 })
  cedula: string;

  @Column({ length: 254 })
  email: string;

  @Column()
  contrasena: string;

  @Column({ length: 255 })
  telefono: string;

  @Column('text', { nullable: true })
  imagen: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;  

  @CreateDateColumn()
  fecha_registro: Date;

  @ManyToOne(() => Rol, rol => rol.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column({ name: 'rol_id' })
  rol_id: number;

  @OneToMany(() => Movimiento, movimiento => movimiento.usuario)
  movimientos: Movimiento[];

  @OneToMany(() => Ficha, ficha => ficha.usuario)
  fichas: Ficha[];
}
