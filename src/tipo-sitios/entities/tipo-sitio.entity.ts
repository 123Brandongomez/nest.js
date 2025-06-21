import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sitio } from '../../sitios/entities/sitio.entity';

@Entity('tipos_sitio')
export class TipoSitio {
  @PrimaryGeneratedColumn()
  id_tipo_sitio: number;

  @Column({ length: 100 })
  nombre_tipo_sitio: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;  

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Sitio, sitio => sitio.tipo_sitio_id)
  sitios: Sitio[];
}
