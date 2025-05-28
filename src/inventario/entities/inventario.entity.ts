import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Material } from 'src/materiales/entities/materiale.entity';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id_inventario: number;

  @Column()
  stock: number;

  @ManyToOne(() => Material, material => material.inventarios)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Sitio, sitio => sitio.inventarios)
  @JoinColumn({ name: 'sitio_id' })
  sitio: Sitio;
}
