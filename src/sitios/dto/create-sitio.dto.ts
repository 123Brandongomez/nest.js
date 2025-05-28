import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateSitioDto {
  @IsNotEmpty()
  @IsString()
  nombre_sitio: string;

  @IsNotEmpty()
  @IsString()
  ubicacion: string;

  @IsNotEmpty()
  @IsString()
  ficha_tecnica: string;
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

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  tipo_sitio_id: number;
}
