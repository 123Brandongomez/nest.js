import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaElementoDto } from './create-categoria-elemento.dto';

export class UpdateCategoriaElementoDto extends PartialType(CreateCategoriaElementoDto) {}
