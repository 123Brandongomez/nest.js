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

      const modulosPorId = new Map<number, Modulo>();
      const [mainModules, subModules] = this.separarModulos(modulosData);

      await this.procesarModulos(mainModules, modulosPorId);
      await this.procesarModulos(subModules, modulosPorId, true);

      this.logger.log('Módulos creados correctamente');
    } catch (error) {
      this.logger.error('Error al crear módulos:', error.message);
    }
  }

  private separarModulos(modulos: any[]) {
    const main = modulos.filter((m) => !m.es_submenu);
    const subs = modulos.filter((m) => m.es_submenu);
    return [main, subs];
  }

  private async procesarModulos(
    modulos: any[],
    mapa: Map<number, Modulo>,
    esSub = false,
  ) {
    for (const m of modulos) {
      try {
        let modulo = await this.moduloRepo.findOneBy({ rutas: m.rutas });
        if (!modulo) {
          if (esSub && m.modulo_padre_id && mapa.has(m.modulo_padre_id)) {
            m.modulo_padre = mapa.get(m.modulo_padre_id);
          }
          modulo = await this.createOrUpdateModulo(m);
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
        modulo_padre: data.modulo_padre, // solo usamos la relación, no el ID directo
      };
      const modulo = this.moduloRepo.create(moduloToCreate);
      return await this.moduloRepo.save(modulo);
    } catch (e) {
      this.logger.error(`Error al guardar módulo ${data.rutas}: ${e.message}`);
      return null;
    }
  }

  private async createPermissions() {
    const admin = await this.rolRepo.findOneBy({ nombre_rol: process.env.SEED_ROLE_ADMIN });
    if (!admin) return this.logger.error('Rol admin no encontrado');

    const modulos = await this.moduloRepo.find();
    for (const modulo of modulos) {
      if (!modulo?.rutas) continue;

      const acciones = ['ver', 'crear', 'editar'];
      for (const accion of acciones) {
        const nombre = `${accion[0].toUpperCase() + accion.slice(1)} ${modulo.rutas}`;
        const codigo = `${accion}_${modulo.rutas.toLowerCase().replace(/ /g, '_')}`;
        const existe = await this.permisoRepo.findOneBy({
          codigo_nombre: codigo,
        });

        if (!existe) {
          await this.permisoRepo.save({
            nombre,
            codigo_nombre: codigo,
            estado: true,
            modulo_id: modulo,
            rol_id: admin,
          });
          this.logger.log(`Permiso creado: ${nombre}`);
        } else {
          this.logger.log(`Permiso ya existe: ${nombre}`);
        }
      }
    }
  }
}
