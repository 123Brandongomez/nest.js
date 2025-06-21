import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Municipio } from '../../municipios/entities/municipio.entity';
import { Sede } from '../../sedes/entities/sede.entity';

@Entity('centros')
export class Centro {
  @PrimaryGeneratedColumn()
  id_centro: number;

  @Column({ length: 100 })
  nombre_centro: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => Municipio, municipio => municipio.centros)
  @JoinColumn({ name: 'municipio_id' })
  municipio: Municipio;

  @OneToMany(() => Sede, sede => sede.centro)
  sedes: Sede[];
}
 