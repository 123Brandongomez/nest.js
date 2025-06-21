import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { FileType } from '../enums/file-type.enum';
import { ImagenesService } from '../services/imagenes.service';

/**
 * Pipe para validar archivos
 */
@Injectable()
export class FileValidationPipe implements PipeTransform {
  /**
   * Constructor del pipe
   * @param fileType Tipo de archivo permitido
   * @param imagenesService Servicio de imu00e1genes
   */
  constructor(
    private readonly fileType: FileType = FileType.IMAGE,
    private readonly imagenesService: ImagenesService = new ImagenesService(),
  ) {}

  /**
   * Transforma y valida el archivo
   * @param value Valor a transformar (archivo)
   * @param metadata Metadatos del argumento
   * @returns Archivo validado
   */
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // Si no hay archivo, retornar null
    if (!value) {
      return null;
    }

    // Obtener extensiones permitidas
    const allowedExtensions = this.imagenesService.getFileExtensionsByType(this.fileType);
    
    // Si es ANY, permitir cualquier tipo de archivo
    if (this.fileType === FileType.ANY) {
      return value;
    }

    // Validar extensiu00f3n
    const ext = '.' + (value.originalname.split('.').pop() || '').toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new BadRequestException(
        `Formato de archivo no permitido. Extensiones permitidas: ${allowedExtensions.join(', ')}`
      );
    }

    return value;
  }
}
