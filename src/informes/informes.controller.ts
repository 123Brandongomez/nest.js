import { Controller, Get, Query, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { InformesService } from './informes.service';

@Controller('informes')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class InformesController {
  constructor(private readonly informesService: InformesService) {}

  // 1. Informe de materiales asignados por usuario
  @Get('materiales-por-usuario')
  @RequirePermiso('informes', 'ver')
  async getMaterialesPorUsuario() {
    return this.informesService.getMaterialesPorUsuario();
  }

  // 2. Inventario de materiales por sede y área
  @Get('inventario-por-sede-area')
  @RequirePermiso('informes', 'ver')
  async getInventarioPorSedeArea() {
    return this.informesService.getInventarioPorSedeArea();
  }

  // 3. Movimientos históricos de materiales
  @Get('movimientos-historicos')
  @RequirePermiso('informes', 'ver')
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
  @RequirePermiso('informes', 'ver')
  async getMaterialesStockMinimo(@Query('stockMinimo') stockMinimo?: number) {
    return this.informesService.getMaterialesStockMinimo(stockMinimo);
  }

  // 5. Materiales más utilizados o solicitados
  @Get('materiales-mas-utilizados')
  @RequirePermiso('informes', 'ver')
  async getMaterialesMasUtilizados(@Query('limite') limite?: number) {
    return this.informesService.getMaterialesMasUtilizados(limite);
  }

  // 6. Usuarios con mayor cantidad de materiales asignados
  @Get('usuarios-con-mas-materiales')
  @RequirePermiso('informes', 'ver')
  async getUsuariosConMasMateriales(@Query('limite') limite?: number) {
    return this.informesService.getUsuariosConMasMateriales(limite);
  }

  // 7. Estado general del inventario
  @Get('estado-inventario')
  @RequirePermiso('informes', 'ver')
  async getEstadoInventario() {
    return this.informesService.getEstadoInventario();
  }

  // 8. Transferencias entre sedes o áreas
  @Get('transferencias-sedes')
  @RequirePermiso('informes', 'ver')
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
  @RequirePermiso('informes', 'ver')
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
  @RequirePermiso('informes', 'ver')
  async getHistorialPorUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.informesService.getHistorialPorUsuario(id);
  }

  // 10. Materiales dados de baja o fuera de servicio
  @Get('materiales-baja')
  @RequirePermiso('informes', 'ver')
  async getMaterialesBaja() {
    return this.informesService.getMaterialesBaja();
  }
}
