import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { PermisoService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';

@Controller('permisos')
@UseGuards(JwtAuthGuard)
export class PermisosController {
  constructor(private readonly permisosService: PermisoService) {}

  @Post()
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'crear')
  create(@Body() dto: CreatePermisoDto) {
    return this.permisosService.create(dto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'ver')
  findAll() {
    return this.permisosService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'ver')
  findOne(@Param('id') id: string) {
    return this.permisosService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'actualizar')
  update(@Param('id') id: string, @Body() updatePermisoDto: UpdatePermisoDto) {
    return this.permisosService.update(+id, updatePermisoDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'actualizar')
  remove(@Param('id') id: string) {
    return this.permisosService.remove(+id);
  }

  // Endpoints para el super administrador

  /**
   * Asigna permisos a un rol específico para un módulo
   * Utiliza directamente el DTO de permisos existente
   */
  @Post('asignar')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'crear')
  async asignarPermiso(
    @Request() req,
    @Body() createPermisoDto: CreatePermisoDto
  ) {
    return this.permisosService.asignarPermiso(req.user.id_usuario, createPermisoDto);
  }

  /**
   * Asigna permisos específicos (ver, crear, actualizar) a un rol para un módulo/tabla
   * Este endpoint es más simple y directo para el super administrador
   */
  @Post('asignar-tabla')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'crear')
  async asignarPermisoTabla(
    @Request() req,
    @Body() createPermisoDto: CreatePermisoDto
  ) {
    const usuarioId = req.user.id_usuario;
    return this.permisosService.asignarPermisoTabla(createPermisoDto);
  }

  /**
   * Obtiene todos los permisos de un rol específico
   */
  @Get('rol/:id')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'ver')
  async getPermisosByRol(@Param('id') id: string, @Request() req) {
    return this.permisosService.getPermisosByRol(+id);
  }

  /**
   * Obtiene todos los permisos para un módulo específico
   */
  @Get('modulo/:id')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'ver')
  async getPermisosByModulo(@Param('id') id: string, @Request() req) {
    return this.permisosService.getPermisosByModulo(+id);
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  @Post('verificar')
  async verificarPermiso(
    @Request() req,
    @Body() body: { modulo: string, accion: string }
  ) {
    const usuarioId = req.user.id_usuario;
    return this.permisosService.verificarPermiso(usuarioId, body.modulo, body.accion);
  }

  /**
   * Obtiene todos los módulos/tablas con sus permisos para un rol específico
   */
  @Get('tablas/:rolId')
  @UseGuards(PermissionGuard)
  @RequirePermiso('permisos', 'ver')
  async getTablasConPermisos(@Param('rolId') rolId: string, @Request() req) {
    return this.permisosService.getTablasConPermisos(+rolId);
  }
}
