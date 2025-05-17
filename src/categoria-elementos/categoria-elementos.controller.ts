import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaElementoService } from './categoria-elementos.service';
import { CreateCategoriaElementoDto } from './dto/create-categoria-elemento.dto';
import { UpdateCategoriaElementoDto } from './dto/update-categoria-elemento.dto';

@Controller('categoria-elementos')
export class CategoriaElementosController {
  constructor(private readonly categoriaElementosService: CategoriaElementoService) {}

  @Post()
  create(@Body() createCategoriaElementoDto: CreateCategoriaElementoDto) {
    return this.categoriaElementosService.create(createCategoriaElementoDto);
  }

  @Get()
  findAll() {
    return this.categoriaElementosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaElementosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaElementoDto: UpdateCategoriaElementoDto) {
    return this.categoriaElementosService.update(+id, updateCategoriaElementoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaElementosService.remove(+id);
  }
}
