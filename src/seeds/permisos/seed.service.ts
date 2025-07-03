import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';
import { Modulo } from '../../modulos/entities/modulo.entity';
import { Permiso } from '../../permisos/entities/permiso.entity';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
    @InjectRepository(Modulo)
    private readonly moduloRepo: Repository<Modulo>,
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  async onModuleInit() {
    this.logger.log('Iniciando SeedService...');
    try {
      await this.seed();
      this.logger.log('Seeding completado con éxito');
    } catch (error) {
      this.logger.error('Error en SeedService:', error);
    }
  }

  public async seed() {
    await this.createRoles();
    await this.createUsers();
    await this.createModules();
    await this.createPermissions();
  }

  private async createRoles() {
    const nombre = process.env.SEED_ROLE_ADMIN;
    const existente = await this.rolRepo.findOneBy({ nombre_rol: nombre });

    if (!existente) {
      await this.rolRepo.save({
        nombre_rol: nombre,
        descripcion: 'Administrador del sistema bienvenido',
        estado: true,
      });
      this.logger.log(`Rol ${nombre} creado`);
    } else {
      this.logger.log(`Rol ${nombre} ya existe`);
    }
  }

  private async createUsers() {
    const admin = await this.rolRepo.findOneBy({ nombre_rol: process.env.SEED_ROLE_ADMIN });
    if (!admin) return this.logger.error('Rol admin no encontrado');

    const existente = await this.usuarioRepo.findOneBy({
      email: process.env.SEED_ADMIN_EMAIL,
    });
    if (!existente) {
      const password = process.env.SEED_ADMIN_PASSWORD ?? '';
      const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      await this.usuarioRepo.save({
        nombre: process.env.SEED_ADMIN_NOMBRE,
        apellido: process.env.SEED_ADMIN_APELLIDO,
        edad: process.env.SEED_ADMIN_EDAD
          ? parseInt(process.env.SEED_ADMIN_EDAD, 10)
          : 0,
        cedula: process.env.SEED_ADMIN_CEDULA,
        email: process.env.SEED_ADMIN_EMAIL,
        contrasena: hashedPassword,
        telefono: process.env.SEED_ADMIN_TELEFONO,
        imagen: '',
        estado: true,
        rol: admin,
        rol_id: admin.id_rol,
      });

      this.logger.log('Usuario admin creado');
    } else {
      this.logger.log('Usuario admin ya existe');
    }
  }

  private async createModules() {
    try {
      const jsonPath = path.resolve(process.cwd(), 'modulos.json');
      const raw = fs.readFileSync(jsonPath, 'utf8').replace(/\/\*.*?\*\//g, '');
      const modulosData = JSON.parse(raw)?.data?.data || [];

      this.logger.log(`Cargados ${modulosData.length} módulos desde el archivo JSON`);
      
      // Ordenamos los módulos para procesar primero los que no tienen padre
      const modulosPorId = new Map<number, Modulo>();
      
      // Primero procesamos los módulos principales (sin modulo_padre_id)
      const mainModules = modulosData.filter(m => !m.modulo_padre_id || !m.es_submenu);
      this.logger.log(`Procesando ${mainModules.length} módulos principales`);
      await this.procesarModulos(mainModules, modulosPorId);
      
      // Luego procesamos los submódulos (con modulo_padre_id)
      const subModules = modulosData.filter(m => m.modulo_padre_id || m.es_submenu);
      this.logger.log(`Procesando ${subModules.length} submódulos`);
      await this.procesarModulos(subModules, modulosPorId, true);

      this.logger.log('Módulos creados correctamente');
    } catch (error) {
      this.logger.error('Error al crear módulos:', error.message);
    }
  }

  // El método separarModulos ya no es necesario porque filtramos directamente en createModules

  private async procesarModulos(
    modulos: any[],
    mapa: Map<number, Modulo>,
    esSub = false,
  ) {
    for (const m of modulos) {
      try {
        let modulo = await this.moduloRepo.findOneBy({ rutas: m.rutas });
        if (!modulo) {
          // Si no es un submódulo o no tiene modulo_padre_id, lo creamos sin referencia al padre
          if (!esSub || !m.modulo_padre_id) {
            // Eliminamos el modulo_padre_id para evitar errores de clave foránea
            const moduloData = { ...m };
            delete moduloData.modulo_padre_id;
            
            this.logger.log(`Creando módulo principal ${m.rutas}`);
            modulo = await this.createOrUpdateModulo(moduloData);
          } 
          // Si es un submódulo y tiene modulo_padre_id, verificamos que el padre exista
          else {
            const moduloPadreId = m.modulo_padre_id;
            
            // Verificar si el módulo padre existe en la base de datos
            const moduloPadre = await this.moduloRepo.findOneBy({ id_modulo: moduloPadreId });
            
            if (moduloPadre) {
              // Si el padre existe, establecemos la relación
              m.modulo_padre = moduloPadre;
              this.logger.log(`Creando submódulo ${m.rutas} con padre ${moduloPadre.rutas} (ID: ${moduloPadreId})`);
              modulo = await this.createOrUpdateModulo(m);
            } else {
              // Si el padre no existe, creamos el módulo sin referencia al padre
              const moduloData = { ...m };
              delete moduloData.modulo_padre_id;
              
              this.logger.log(`Creando módulo ${m.rutas} sin padre porque el padre ID:${moduloPadreId} no existe`);
              modulo = await this.createOrUpdateModulo(moduloData);
            }
          }
        } else {
          // Si el módulo ya existe y tiene modulo_padre_id, verificamos que el padre exista
          if (m.modulo_padre_id) {
            const moduloPadre = await this.moduloRepo.findOneBy({ id_modulo: m.modulo_padre_id });
            
            if (moduloPadre) {
              // Actualizamos la relación si el padre existe
              modulo.modulo_padre_id = m.modulo_padre_id;
              modulo.modulo_padre = moduloPadre;
              await this.moduloRepo.save(modulo);
              this.logger.log(`Actualizado modulo_padre_id para ${modulo.rutas}: ${m.modulo_padre_id}`);
            } else {
              this.logger.warn(`No se actualizó el módulo ${modulo.rutas} porque el padre ID:${m.modulo_padre_id} no existe`);
            }
          }
        }
        
        if (modulo) mapa.set(modulo.id_modulo, modulo);
      } catch (e) {
        this.logger.error(`Error en módulo ${m.rutas}: ${e.message}`);
      }
    }
  }

  private async createOrUpdateModulo(data: any): Promise<Modulo | null> {
    try {
      const moduloToCreate: DeepPartial<Modulo> = {
        rutas: data.rutas,
        descripcion_ruta: data.descripcion_ruta,
        mensaje_cambio: data.mensaje_cambio,
        imagen: data.imagen || '',
        estado: data.estado,
        es_submenu: data.es_submenu,
        modulo_padre: data.modulo_padre, // Relación con el módulo padre
        modulo_padre_id: data.modulo_padre_id, // ID directo del módulo padre
      };
      const modulo = this.moduloRepo.create(moduloToCreate);
      return await this.moduloRepo.save(modulo);
    } catch (e) {
      this.logger.error(`Error al guardar módulo ${data.rutas}: ${e.message}`);
      return null;
    }
  }

  private async createPermissions() {
    this.logger.log('Iniciando creación de permisos para Super Administrador...');
    
    // Buscar el rol de Super Administrador
    const admin = await this.rolRepo.findOneBy({ nombre_rol: process.env.SEED_ROLE_ADMIN });
    if (!admin) {
      this.logger.error(`Rol ${process.env.SEED_ROLE_ADMIN} no encontrado`);
      return;
    }
    
    this.logger.log(`Rol ${admin.nombre_rol} encontrado con ID: ${admin.id_rol}`);

    // Obtener todos los módulos
    const modulos = await this.moduloRepo.find();
    this.logger.log(`Se encontraron ${modulos.length} módulos para asignar permisos`);
    
    // Para cada módulo, crear un permiso completo para el Super Administrador
    for (const modulo of modulos) {
      if (!modulo?.rutas) continue;
      
      // Verificar si ya existe un permiso para este módulo y rol
      const permisoExistente = await this.permisoRepo.findOne({
        where: {
          modulo_id: { id_modulo: modulo.id_modulo },
          rol_id: { id_rol: admin.id_rol }
        }
      });
      
      if (!permisoExistente) {
        // Crear un nuevo permiso con todos los privilegios
        const nuevoPermiso = this.permisoRepo.create({
          nombre: `Permiso completo para ${modulo.rutas}`,
          puede_ver: true,
          puede_crear: true,
          puede_actualizar: true,
          puede_eliminar: true,
          estado: true,
          modulo_id: modulo,
          rol_id: admin
        });
        
        await this.permisoRepo.save(nuevoPermiso);
        this.logger.log(`✅ Permiso completo creado para módulo: ${modulo.rutas}`);
      } else {
        // Actualizar el permiso existente para asegurar que tiene todos los privilegios
        permisoExistente.puede_ver = true;
        permisoExistente.puede_crear = true;
        permisoExistente.puede_actualizar = true;
        permisoExistente.puede_eliminar = true;
        
        await this.permisoRepo.save(permisoExistente);
        this.logger.log(`✅ Permiso actualizado para módulo: ${modulo.rutas}`);
      }
    }
    
    this.logger.log('Finalizada la creación de permisos para Super Administrador');
  }
}
