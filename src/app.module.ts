import { Module } from '@nestjs/common';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { ModulosModule } from './modulos/modulos.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { CentrosModule } from './centros/centros.module';
import { SedesModule } from './sedes/sedes.module';
import { AreasModule } from './areas/areas.module';
import { ProgramasModule } from './programas/programas.module';
import { TipoSitiosModule } from './tipo-sitios/tipo-sitios.module';
import { SitiosModule } from './sitios/sitios.module';
import { TiposMovimientoModule } from './tipos-movimientos/tipos-movimientos.module';
import { MovimientosModule } from './movimientos/movimientos.module';
import { FichasModule } from './fichas/fichas.module';
import { CategoriaElementosModule } from './categoria-elementos/categoria-elementos.module';
import { TipoMaterialesModule } from './tipo-materiales/tipo-materiales.module';
import { MaterialesModule } from './materiales/materiales.module';
import { AuthModule } from './auth/auth.module';
import { InformesModule } from './informes/informes.module';
import { SeedModule } from './seeds/permisos/seed.module';

// Importar módulos comunes
import { ConfigModule, DatabaseModule } from './common/modules';
import { PermissionModule } from './common/guards/permission.module';
import { GlobalGuardsModule } from './common/guards/global-guards.module';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CaracteristicasModule } from './caracteristicas/caracteristicas.module';
import { InventarioModule } from './inventario/inventario.module';

@Module({
  imports: [
    // conexiona  a la base de datos
    ConfigModule.register(),
    DatabaseModule.register(),
    
    // Módulo de permisos personalizado
    PermissionModule,
    
    // Módulo de guards globales para requerir token en todas las rutas
    GlobalGuardsModule,
  
    UsuariosModule, 
    RolesModule, 
    PermisosModule, 
    ModulosModule, 
    MunicipiosModule, 
    CentrosModule,
    SedesModule, 
    AreasModule, 
    ProgramasModule, 
    TipoSitiosModule, 
    SitiosModule, 
    TiposMovimientoModule,
    MovimientosModule, 
    FichasModule, 
    CategoriaElementosModule, 
    TipoMaterialesModule, 
    MaterialesModule,
    AuthModule,
    InformesModule,
    CaracteristicasModule,
    InventarioModule,
    SeedModule,
  ],

  controllers: [],
  providers: [
    // Filtro global para excepciones HTTP
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Interceptor global para transformar respuestas
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
