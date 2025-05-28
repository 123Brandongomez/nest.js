/**
 * Interfaz para entidades con ID personalizado
 */
export interface EntityWithCustomId {
  /**
   * Propiedad que contiene el ID de la entidad
   * Puede tener cualquier nombre (id_usuario, id_rol, etc.)
   */
  [key: string]: any;
}
