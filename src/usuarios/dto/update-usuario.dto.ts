import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// Asegúrate que UpdateUsuarioDto extienda correctamente el nuevo CreateUsuarioDto con rol_id
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}
