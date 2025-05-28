import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Movimiento } from '../../movimientos/entities/movimiento.entity';

@Entity('tipos_movimiento')
export class TipoMovimiento {
  @PrimaryGeneratedColumn()
  id_tipo_movimiento: number;

  @Column({ length: 255 })
  tipo_movimiento: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @OneToMany(() => Movimiento, movimiento => movimiento.tipo_movimiento_id)
  movimientos: Movimiento[];
}
 