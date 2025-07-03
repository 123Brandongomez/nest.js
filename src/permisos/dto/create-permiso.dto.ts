import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePermisoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;


  @IsNotEmpty()
  @IsNumber({}, { each: true })
  modulo_id: number[]; 

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  rol_id: number[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  puede_ver?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  puede_crear?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  puede_actualizar?: boolean;



  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1)
  estado?: boolean;
}
