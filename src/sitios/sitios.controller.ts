import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SitioService } from './sitios.service';
import { CreateSitioDto } from './dto/create-sitio.dto';
import { UpdateSitioDto } from './dto/update-sitio.dto';

@Controller('sitios')
export class SitiosController {
  constructor(private readonly sitiosService: SitioService) {}

  @Post()
  create(@Body() createSitioDto: CreateSitioDto) {
    return this.sitiosService.create(createSitioDto);
  }

  @Get()
  findAll() {
    return this.sitiosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sitiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSitioDto: UpdateSitioDto) {
    return this.sitiosService.update(+id, updateSitioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sitiosService.remove(+id);
  }
}
