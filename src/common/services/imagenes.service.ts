import { Injectable } from '@nestjs/common';
import { ImagenResponseDto } from '../dto/imagen-response.dto';
import { ImagenesConfig } from '../interfaces/imagenes-config.interface';
import { join } from 'path';
import { FileType } from '../enums/file-type.enum';

/**
 * Servicio para el manejo de imu00e1genes
 */
@Injectable()
export class ImagenesService {
  /**
   * Ruta base para acceder a las imu00e1genes desde el cliente
   * @private
   */
  private readonly baseUrl = '/img';

  /**
   * Obtiene las extensiones permitidas segu00fan el tipo de archivo
   * @param fileType Tipo de archivo
   * @returns Array de extensiones permitidas
   */
  getFileExtensionsByType(fileType: FileType = FileType.IMAGE): string[] {
    switch (fileType) {
      case FileType.IMAGE:
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      case FileType.DOCUMENT:
        return ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'];
      case FileType.ANY:
        return [];
      default:
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    }
  }

  /**
   * Obtiene las opciones de configuraciu00f3n para Multer
   * @param config Configuraciu00f3n para el mu00f3dulo de imu00e1genes
   * @returns Opciones de configuraciu00f3n para Multer
   */
  getMulterOptions(config: ImagenesConfig) {
    const fileType = config.fileType || FileType.IMAGE;
    const allowedExtensions = this.getFileExtensionsByType(fileType);
    const maxFileSize = config.maxFileSize || 5 * 1024 * 1024; // 5MB por defecto

    return {
      fileFilter: (req, file, cb) => {
        // Si es ANY, permitir cualquier tipo de archivo
        if (fileType === FileType.ANY) {
          return cb(null, true);
        }

        // Validar extensiu00f3n
        const ext = '.' + file.originalname.split('.').pop().toLowerCase();
        if (allowedExtensions.includes(ext)) {
          return cb(null, true);
        }

        // Rechazar archivo no permitido
        const errorMsg = `Formato de archivo no permitido. Extensiones permitidas: ${allowedExtensions.join(', ')}`;
        return cb(new Error(errorMsg), false);
      },
      limits: {
        fileSize: maxFileSize,
      }
    };
  }

  /**
   * Construye la respuesta para una imagen subida
   * @param file Archivo subido
   * @param customBaseUrl URL base personalizada (opcional)
   * @returns DTO con la informaciu00f3n de la imagen
   */
  mapFileToResponse(file: Express.Multer.File, customBaseUrl?: string): ImagenResponseDto {
    const baseUrl = customBaseUrl || this.baseUrl;
    
    return {
      filename: file.filename,
      path: file.path,
      url: `${baseUrl}/${file.filename}`
    };
  }

  /**
   * Construye la respuesta para mu00faltiples imu00e1genes subidas
   * @param files Archivos subidos
   * @param customBaseUrl URL base personalizada (opcional)
   * @returns Array de DTOs con la informaciu00f3n de las imu00e1genes
   */
  mapFilesToResponse(files: Express.Multer.File[], customBaseUrl?: string): ImagenResponseDto[] {
    return files.map(file => this.mapFileToResponse(file, customBaseUrl));
  }

  /**
   * Obtiene la ruta completa de una imagen
   * @param filename Nombre del archivo
   * @param basePath Ruta base donde se almacenan las imu00e1genes
   * @returns Ruta completa del archivo
   */
  getImagePath(filename: string, basePath: string): string {
    return join(basePath, filename);
  }

  /**
   * Construye la URL completa para acceder a una imagen
   * @param filename Nombre del archivo
   * @param baseUrl URL base para acceder a las imu00e1genes
   * @returns URL completa de la imagen
   */
  getImageUrl(filename: string, baseUrl: string = this.baseUrl): string {
    return `${baseUrl}/${filename}`;
  }
}
