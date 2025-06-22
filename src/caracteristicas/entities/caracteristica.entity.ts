import { Material } from "src/materiales/entities/materiale.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Caracteristica {
  @PrimaryGeneratedColumn()
  id_caracteristica: number;

  @Column({ default: false })
  placa_sena: boolean;

  @Column({ default: false })
  descripcion: boolean;

  @ManyToOne(() => Material, material => material.caracteristicas)
  @JoinColumn({ name: 'material_id' })
  material: Material;
}

