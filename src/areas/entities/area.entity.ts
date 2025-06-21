import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Sede } from '../../sedes/entities/sede.entity';
import { Programa } from '../../programas/entities/programa.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id_area: number;

  @Column({ length: 100 })
  nombre_area: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => Sede, sede => sede.areas)
  @JoinColumn({ name: 'sede_id' })
  sede: Sede;

  @OneToMany(() => Programa, programa => programa.area)
  programas: Programa[];
}
