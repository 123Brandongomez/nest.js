import { Injectable } from '@nestjs/common';
import { InventarioService } from '../../inventario/inventario.service';

/**
 * Servicio común para la gestión de inventario
 * Proporciona métodos para actualizar el stock de materiales en diferentes situaciones
 */
@Injectable()
export class InventarioManagerService {
  constructor(private readonly inventarioService: InventarioService) {}

  /**
   * Actualiza el stock de un material
   * @param materialId ID del material
   * @param cantidad Cantidad a añadir (positiva) o restar (negativa)
   * @returns true si la operación fue exitosa, false en caso contrario
   */
  async actualizarStock(materialId: number, cantidad: number): Promise<boolean> {
    try {
      await this.inventarioService.actualizarStock(materialId, cantidad);
      return true;
    } catch (error) {
      console.error(`Error al actualizar el inventario: ${error.message}`);
      return false;
    }
  }

  /**
   * Registra una nueva característica de material en el inventario
   * @param materialId ID del material
   * @returns true si la operación fue exitosa, false en caso contrario
   */
  async registrarNuevaCaracteristica(materialId: number): Promise<boolean> {
    // Cada característica representa 1 unidad en el inventario
    return this.actualizarStock(materialId, 1);
  }

  /**
   * Registra un préstamo de material en el inventario
   * @param materialId ID del material
   * @param cantidad Cantidad prestada
   * @returns true si la operación fue exitosa, false en caso contrario
   */
  async registrarPrestamo(materialId: number, cantidad: number): Promise<boolean> {
    // Un préstamo disminuye el stock
    return this.actualizarStock(materialId, -cantidad);
  }

  /**
   * Registra una devolución de material en el inventario
   * @param materialId ID del material
   * @param cantidad Cantidad devuelta
   * @returns true si la operación fue exitosa, false en caso contrario
   */
  async registrarDevolucion(materialId: number, cantidad: number): Promise<boolean> {
    // Una devolución aumenta el stock
    return this.actualizarStock(materialId, cantidad);
  }
}
