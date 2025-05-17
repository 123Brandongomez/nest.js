import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TipoSitio } from '../../tipo-sitios/entities/tipo-sitio.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Material } from '../../materiales/entities/materiale.entity';

@Entity('sitios')
export class Sitio {
  @PrimaryGeneratedColumn()
  id_sitio: number;

  @Column({ length: 100 })
  nombre_sitio: string;

  @Column('text')
  ubicacion: string;

  @Column('text')
  ficha_tecnica: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => TipoSitio, tipo => tipo.sitios)
  @JoinColumn({ name: 'tipo_sitio_id' })
  tipo_sitio_id: TipoSitio;

  @OneToMany(() => Material, material => material.sitio_id)
  materiales: Material[];
}
 