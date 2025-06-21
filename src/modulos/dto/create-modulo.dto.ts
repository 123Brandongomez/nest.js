import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateModuloDto {
  @IsNotEmpty()
  @IsString()
  rutas: string;

  @IsNotEmpty()
  @IsString()
  descripcion_ruta: string;

  @IsNotEmpty()
  @IsString()
  mensaje_cambio: string;

  @IsOptional()
  @IsString()
  imagen: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean;
  
  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  es_submenu: boolean;
  
  @ValidateIf(o => o.es_submenu === true)
  @IsNotEmpty({ message: 'Si es un submódulo, debe especificar el módulo padre' })
  @IsNumber({}, { message: 'El ID del módulo padre debe ser un número' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  modulo_padre_id: number;
  
  @IsNotEmpty()
  @IsString()
  fecha_accion: string;

}
