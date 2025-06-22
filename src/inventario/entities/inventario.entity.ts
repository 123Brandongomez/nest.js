import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sitio } from 'src/sitios/entities/sitio.entity';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id_inventario: number;

  @Column()
  stock: number;

  @ManyToOne(() => Sitio, sitio => sitio.inventarios)
  @JoinColumn({ name: 'sitio_id' })
  sitio: Sitio;

  @Column({ nullable: true, length: 255 })
  placa_sena?: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;
}
