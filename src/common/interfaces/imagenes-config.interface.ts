import { FileType } from '../enums/file-type.enum';

/**
 * Interfaz para la configuración del módulo de imágenes
 */
export interface ImagenesConfig {
  /**
   * Ruta donde se almacenarán las imágenes
   */
  destinationPath: string;

  /**
   * Tipo de archivo permitido (por defecto: FileType.IMAGE)
   */
  fileType?: FileType;

  /**
   * Tamaño máximo del archivo en bytes (por defecto: 5MB)
   */
  maxFileSize?: number;

  /**
   * URL base para acceder a las imágenes (por defecto: '/img')
   */
  baseUrl?: string;
}
