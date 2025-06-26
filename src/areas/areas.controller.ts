import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { RequirePermiso } from '../common/decorators/permission.decorator';
import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermiso('areas', 'crear')
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  @RequirePermiso('areas', 'ver')
  findAll() {
    return this.areasService.findAll();
  }

  @Get(':id')
  @RequirePermiso('areas', 'ver')
  findOne(@Param('id') id: string) {
    return this.areasService.findOne(+id);
  }

  @Put(':id')
  @RequirePermiso('areas', 'actualizar')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.areasService.update(+id, updateAreaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermiso('areas', 'eliminar')
  remove(@Param('id') id: string) {
    return this.areasService.remove(+id);
  }
}
