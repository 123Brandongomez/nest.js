import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class CreateInventarioDto {
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  material_id: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  sitio_id: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;
}
