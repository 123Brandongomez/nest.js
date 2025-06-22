import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateCaracteristicaDto {
  @IsNotEmpty()
  @IsString()
  placa_sena: boolean;

  @IsNotEmpty()
  @IsString()
  descripcion: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  material_id: number;

}
