import { IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProgramaDto {
  @IsNotEmpty()
  @IsNumber()
  id_programa: number;

  @IsNotEmpty()
  @IsString()
  nombre_programa: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  estado: boolean;

  @IsNotEmpty()
  @IsString()
  fecha_creacion: string;

  @IsNotEmpty()
  @IsString()
  fecha_modificacion: string;

  @IsNotEmpty()
  @IsNumber()
  area_id: number;
}
