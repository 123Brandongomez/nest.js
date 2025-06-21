import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateMaterialeDto {
    @IsNotEmpty()
    @IsString()
    codigo_sena: string;

    @IsNotEmpty()
    @IsString()
    nombre_material: string;

    @IsNotEmpty()
    @IsString()
    descripcion_material: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    stock: number;

    @IsNotEmpty()
    @IsString()
    unidad_medida: string;

    @IsNotEmpty()
    @IsDateString()
    fecha_vencimiento: string;

    @IsNotEmpty()
    @IsBoolean()
    @Type(() => Boolean)
    producto_perecedero: boolean;

    @IsNotEmpty()
    @IsBoolean()
    @Type(() => Boolean)
    estado: boolean;

    @IsOptional()
    @IsString()
    imagen?: string;

    @IsNotEmpty()
    @IsNumber()
    categoria_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    tipo_material_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    sitio_id: number;
}
