import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoMaterialeDto } from './create-tipo-materiale.dto';

export class UpdateTipoMaterialeDto extends PartialType(CreateTipoMaterialeDto) {}
