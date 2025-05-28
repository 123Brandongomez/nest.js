import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Material } from '../../materiales/entities/materiale.entity';

@Entity('categorias_elementos')
export class CategoriaElemento {
  @PrimaryGeneratedColumn()
  id_categoria_elemento: number;

  @Column({ length: 255 })
  codigo_unpsc: string;

  @Column({ length: 255 })
  nombre_categoria: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Material, material => material.categoria_id)
  materiales: Material[];
}
 