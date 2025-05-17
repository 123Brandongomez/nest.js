import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMaterialService } from './tipo-materiales.service';
import { CreateTipoMaterialeDto } from './dto/create-tipo-materiale.dto';
import { UpdateTipoMaterialeDto } from './dto/update-tipo-materiale.dto';

@Controller('tipo-materiales')
export class TipoMaterialesController {
  constructor(private readonly tipoMaterialesService: TipoMaterialService) {}

  @Post()
  create(@Body() createTipoMaterialeDto: CreateTipoMaterialeDto) {
    return this.tipoMaterialesService.create(createTipoMaterialeDto);
  }

  @Get()
  findAll() {
    return this.tipoMaterialesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMaterialesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoMaterialeDto: UpdateTipoMaterialeDto) {
    return this.tipoMaterialesService.update(+id, updateTipoMaterialeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMaterialesService.remove(+id);
  }
}
