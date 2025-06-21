import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Centro } from '../../centros/entities/centro.entity';
import { Area } from '../../areas/entities/area.entity';

@Entity('sedes')
export class Sede {
  @PrimaryGeneratedColumn()
  id_sede: number;

  @Column({ length: 100 })
  nombre_sede: string;

  @Column({ length: 100 })
  direccion_sede: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => Centro, centro => centro.sedes)
  @JoinColumn({ name: 'centro_id' })
  centro: Centro;

  @OneToMany(() => Area, area => area.sede)
  @JoinColumn({ name: 'sede_id' })
  areas: Area[];
}
