import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoSitiosService } from './tipo-sitios.service';
import { CreateTipoSitioDto } from './dto/create-tipo-sitio.dto';
import { UpdateTipoSitioDto } from './dto/update-tipo-sitio.dto';

@Controller('tipo-sitios')
export class TipoSitiosController {
  constructor(private readonly tipoSitiosService: TipoSitiosService) {}

  @Post()
  create(@Body() createTipoSitioDto: CreateTipoSitioDto) {
    return this.tipoSitiosService.create(createTipoSitioDto);
  }

  @Get()
  findAll() {
    return this.tipoSitiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoSitiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoSitioDto: UpdateTipoSitioDto) {
    return this.tipoSitiosService.update(+id, updateTipoSitioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoSitiosService.remove(+id);
  }
}
