/**
 * DTO para la respuesta de carga de imu00e1genes
 */
export class ImagenResponseDto {
  /**
   * Nombre del archivo guardado
   */
  filename: string;

  /**
   * Ruta donde se guardu00f3 la imagen
   */
  path: string;

  /**
   * URL para acceder a la imagen
   */
  url: string;
}
