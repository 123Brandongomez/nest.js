import { PartialType } from '@nestjs/mapped-types';
import { CreateTiposMovimientoDto } from './create-tipos-movimiento.dto';

export class UpdateTiposMovimientoDto extends PartialType(CreateTiposMovimientoDto) {}
