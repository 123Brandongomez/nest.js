import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

/**
 * Clase de utilidad para el manejo de archivos
 */
export class FileHelper {
  /**
   * Genera un nombre de archivo único basado en el nombre original
   * @param originalname Nombre original del archivo
   * @returns Nombre único para el archivo
   */
  static generateFileName(originalname: string): string {
    // Obtener la extensión del archivo
    const fileExtension = extname(originalname);
    
    // Crear un nombre único usando timestamp y un número aleatorio
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    
    // Retornar el nombre único con la extensión original
    return `${uniqueSuffix}${fileExtension}`;
  }

  /**
   * Asegura que el directorio de destino exista, creándolo si es necesario
   * @param path Ruta del directorio
   */
  static ensureDirectoryExists(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  /**
   * Valida si la extensión del archivo es permitida
   * @param filename Nombre del archivo
   * @param allowedExtensions Extensiones permitidas
   * @returns true si la extensión es permitida, false en caso contrario
   */
  static isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const ext = extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
  }
}
