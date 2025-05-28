import { IsNotEmpty, IsString, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMunicipioDto {
  @IsNotEmpty({ message: 'se requiere nombre municipio' })
  @IsString({ message: 'nombre municipio debe ser un string' })
  nombre_municipio: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean; 

  @IsNotEmpty({ message: 'se requiere fecha creacion' })
  @IsDateString()
  fecha_creacion: string;

  @IsNotEmpty({ message: 'se requiere fecha modificacion' })
  @IsDateString()
  @IsNotEmpty({ message: 'fecha modificacion debe ser una fecha válida en formato ISO' })
  fecha_modificacion: string;
}
