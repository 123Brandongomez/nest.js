import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCaracteristicaDto {
  @IsNotEmpty()
  @IsString()
  placa_sena: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  material_id: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  sitio_id?: number;
}
