import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';
import { Modulo } from '../../modulos/entities/modulo.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol, Modulo, Permiso])
  ],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit() {
    // Ejecutar el seeder al iniciar el módulo
    await this.seedService.seed();
  }
}
