import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Material } from '../../materiales/entities/materiale.entity';

@Entity('tipo_materiales')
export class TipoMaterial {
  @PrimaryGeneratedColumn()
  id_tipo_material: number;

  @Column({ length: 255 })
  tipo_elemento: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Material, material => material.tipo_material_id)
  materiales: Material[];
}
 