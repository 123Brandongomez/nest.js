import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { InformesService } from './informes.service';

@Controller('informes')
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  // 1. Informe de materiales asignados por usuario
  @Get('materiales-por-usuario')
  async getMaterialesPorUsuario() {
    return this.informesService.getMaterialesPorUsuario();
  }

  // 2. Inventario de materiales por sede y área
  @Get('inventario-por-sede-area')
  async getInventarioPorSedeArea() {
    return this.informesService.getInventarioPorSedeArea();
  }

  // 3. Movimientos históricos de materiales
  @Get('movimientos-historicos')
  async getMovimientosHistoricos(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const fechaInicioObj = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinObj = fechaFin ? new Date(fechaFin) : undefined;
    return this.informesService.getMovimientosHistoricos(fechaInicioObj, fechaFinObj);
  }

  // 4. Materiales próximos a agotarse (stock mínimo)
  @Get('materiales-stock-minimo')
  async getMaterialesStockMinimo(@Query('stockMinimo') stockMinimo?: number) {
    return this.informesService.getMaterialesStockMinimo(stockMinimo);
  }

  // 5. Materiales más utilizados o solicitados
  @Get('materiales-mas-utilizados')
  async getMaterialesMasUtilizados(@Query('limite') limite?: number) {
    return this.informesService.getMaterialesMasUtilizados(limite);
  }

  // 6. Usuarios con mayor cantidad de materiales asignados
  @Get('usuarios-con-mas-materiales')
  async getUsuariosConMasMateriales(@Query('limite') limite?: number) {
    return this.informesService.getUsuariosConMasMateriales(limite);
  }

  // 7. Estado general del inventario
  @Get('estado-inventario')
  async getEstadoInventario() {
    return this.informesService.getEstadoInventario();
  }

  // 8. Transferencias entre sedes o áreas
  @Get('transferencias-sedes')
  async getTransferenciasSedes(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const fechaInicioObj = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinObj = fechaFin ? new Date(fechaFin) : undefined;
    return this.informesService.getTransferenciasSedes(fechaInicioObj, fechaFinObj);
  }

  // 9. Historial de uso de materiales por usuario
  @Get('historial-por-usuario')
  async getHistorialPorUsuarioGeneral(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('usuarioId') usuarioId?: number,
  ) {
    const fechaInicioObj = fechaInicio ? new Date(fechaInicio) : undefined;
    const fechaFinObj = fechaFin ? new Date(fechaFin) : undefined;
    return this.informesService.getHistorialPorUsuarioGeneral(fechaInicioObj, fechaFinObj, usuarioId);
  }

  // Historial por usuario específico
  @Get('historial-por-usuario/:id')
  async getHistorialPorUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.informesService.getHistorialPorUsuario(id);
  }

  // 10. Materiales dados de baja o fuera de servicio
  @Get('materiales-baja')
  async getMaterialesBaja() {
    return this.informesService.getMaterialesBaja();
  }
}
