import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateModuloDto {
  @IsNotEmpty()
  @IsString()
  fecha_accion: string;

  @IsNotEmpty()
  @IsString()
  rutas: string;

  @IsNotEmpty()
  @IsString()
  descripcion_ruta: string;

  @IsNotEmpty()
  @IsString()
  mensaje_cambio: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean;
}
