import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateFichaDto {
  @IsNotEmpty()
  @IsNumber()
  id_ficha: number;

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
  programa: number;
}

