import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermisoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  codigo_nombre: string;

  @IsNotEmpty()
  @IsNumber()
  modulo: number;

  @IsNotEmpty()
  @IsNumber()
  rol: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean; 
}
