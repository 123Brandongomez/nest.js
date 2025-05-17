import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoriaElemento } from '../../categoria-elementos/entities/categoria-elemento.entity';
import { TipoMaterial } from '../../tipo-materiales/entities/tipo-materiale.entity';
import { Sitio } from '../../sitios/entities/sitio.entity';
import { Movimiento } from '../../movimientos/entities/movimiento.entity';

@Entity('materiales')
export class Material {
  @PrimaryGeneratedColumn()
  id_material: number;

  @Column({ length: 255 })
  codigo_sena: string;

  @Column({ length: 255 })
  nombre_material: string;

  @Column('text')
  descripcion_material: string;

  @Column()
  stock: number;

  @Column({ length: 255 })
  unidad_medida: string;

  @Column()
  producto_perecedero: boolean;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'timestamp' })
  fecha_vencimiento: Date;

  @Column('text', { nullable: true })
  imagen: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => CategoriaElemento, (categoria) => categoria.materiales)
  @JoinColumn({ name: 'categoria_id' })
  categoria_id: CategoriaElemento;

  @ManyToOne(() => TipoMaterial, (tipo) => tipo.materiales)
  @JoinColumn({ name: 'tipo_material_id' })
  tipo_material_id: TipoMaterial;

  @ManyToOne(() => Sitio, (sitio) => sitio.materiales)
  @JoinColumn({ name: 'sitio_id' })
  sitio_id: Sitio;

  @OneToMany(() => Movimiento, (movimiento) => movimiento.material_id)
  movimientos: Movimiento[];
}
