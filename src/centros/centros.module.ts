import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CentrosService } from './centros.service';
import { CentrosController } from './centros.controller';
import { Centro } from './entities/centro.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Centro])],
  controllers: [CentrosController],
  providers: [CentrosService],
  exports: [CentrosService],
})
export class CentrosModule {}
