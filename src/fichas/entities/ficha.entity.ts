import { Entity, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Programa } from '../../programas/entities/programa.entity';

@Entity('fichas')
export class Ficha {
  @PrimaryColumn()
  id_ficha: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.fichas)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Programa, programa => programa.fichas)
  @JoinColumn({ name: 'programa_id' })
  programa: Programa;
} 
