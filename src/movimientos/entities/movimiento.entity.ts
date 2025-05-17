import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoMovimiento } from '../../tipos-movimientos/entities/tipos-movimiento.entity';
import { Material } from '../../materiales/entities/materiale.entity';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn()
  id_movimiento: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'float', default: 0 })
  cantidad: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_modificacion: Date;

  @ManyToOne(() => Usuario, usuario => usuario.movimientos)
  @JoinColumn({ name: 'usuario_movimiento_id' })
  usuario: Usuario;

  @ManyToOne(() => TipoMovimiento, tipo => tipo.movimientos)
  @JoinColumn({ name: 'tipo_movimiento_id' })
  tipo_movimiento_id: TipoMovimiento;

  @ManyToOne(() => Material, material => material.movimientos, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'material_id' })
  material_id: Material;
}
