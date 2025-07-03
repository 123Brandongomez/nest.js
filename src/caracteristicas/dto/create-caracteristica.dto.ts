import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsBoolean } from 'class-validator';

export class CreateCaracteristicaDto {
  @IsOptional() // Si quieres que sea opcional
  @IsBoolean()
  placa_sena?: boolean;

  @IsOptional()
  @IsBoolean()
  descripcion?: boolean;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  material_id: number;
}
