import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Centro } from '../../centros/entities/centro.entity';

@Entity('municipios')
export class Municipio {
  @PrimaryGeneratedColumn()
  id_municipio: number;

  @Column({ length: 255 })
  nombre_municipio: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Centro, centro => centro.municipio)
  centros: Centro[];
}
