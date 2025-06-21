import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoriaElementoDto {
  @IsNotEmpty({ message: 'El campo codigo_upsena es obligatorio' })
  @IsString()
  codigo_unpsc: string;

  @IsNotEmpty()
  @IsString()
  nombre_categoria: string;

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
}
 