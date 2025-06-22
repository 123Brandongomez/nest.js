import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateInventarioDto {
  sitio_id: number;
  material_id: number;
  stock: number;

  // estos valores solo se deben enviar si la característica lo requiere
  placa_sena?: string;
  descripcion?: string;
}

