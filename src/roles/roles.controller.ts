import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { RolService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RolesController {
  constructor(private readonly rolesService: RolService) {}

  @Post()
  @RequirePermiso('roles', 'crear')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequirePermiso('roles', 'ver')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @RequirePermiso('roles', 'ver')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('roles', 'actualizar')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RequirePermiso('roles', 'eliminar')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
