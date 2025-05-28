import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  nombre_rol: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1) // Convierte 1 o "true" a booleano
  estado: boolean;

  @IsNotEmpty()
  @IsString()
  fecha_creacion: string;
}
