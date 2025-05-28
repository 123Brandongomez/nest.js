import { Material } from "src/materiales/entities/materiale.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Caracteristica {

    @PrimaryGeneratedColumn()
    id_caracteristica: number;

    @Column({ length: 255 })
    placa_sena: string;

    @Column('text')
    descripcion: string;

    @ManyToOne(() => Material, material => material.caracteristicas)
    @JoinColumn({ name: 'material_id' })
    material: Material;


}
