import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCentroDto {
  @IsNotEmpty()
  @IsString()
  nombre_centro: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean; 

  @IsNotEmpty()
  @IsString()
  fecha_creacion: string;

  @IsNotEmpty()
  @IsString()
 fecha_modificacion: string;

  @IsOptional()
  @IsNumber()
  id_municipio?: number;
}
