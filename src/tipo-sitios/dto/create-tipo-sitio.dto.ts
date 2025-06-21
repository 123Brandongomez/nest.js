import { IsDate, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTipoSitioDto {
  @IsNotEmpty()
  @IsString()
  nombre_tipo_sitio: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean;

  @IsNotEmpty()
  @IsString()
  fecha_creacion: String;

  @IsNotEmpty()
  @IsString()
  fecha_modificacion: String;
}
