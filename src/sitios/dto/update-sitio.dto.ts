import { PartialType } from '@nestjs/mapped-types';
import { CreateSitioDto } from './create-sitio.dto';

// Asegúrate que UpdateSitioDto extienda correctamente el nuevo CreateSitioDto con tipo_sitio_id
export class UpdateSitioDto extends PartialType(CreateSitioDto) {}
