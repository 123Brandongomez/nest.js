import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/**
 * Decorador para subir un solo archivo
 * @param fieldName Nombre del campo del formulario que contiene el archivo
 * @param localOptions Opciones adicionales de Multer (opcional)
 * @returns Decorador compuesto
 */
export function UploadFile(fieldName: string = 'file', localOptions?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, localOptions)),
  );
}

/**
 * Decorador para subir mu00faltiples archivos
 * @param fieldName Nombre del campo del formulario que contiene los archivos
 * @param maxCount Nu00famero mu00e1ximo de archivos permitidos
 * @param localOptions Opciones adicionales de Multer (opcional)
 * @returns Decorador compuesto
 */
export function UploadFiles(fieldName: string = 'files', maxCount: number = 10, localOptions?: MulterOptions) {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, maxCount, localOptions)),
  );
}
