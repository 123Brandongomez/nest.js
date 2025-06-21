import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Rol } from '../../roles/entities/role.entity';
import { Repository } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const rolRepo = app.get<Repository<Rol>>(getRepositoryToken(Rol));
    const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));

    // 1. Crear el rol admin si no existe
    let rolAdmin = await rolRepo.findOneBy({ nombre_rol: process.env.SEED_ROLE_ADMIN });
    if (!rolAdmin) {
      rolAdmin = await rolRepo.save({
        nombre_rol: process.env.SEED_ROLE_ADMIN,
        descripcion: 'Administrador del sistema',
        estado: true
      });
      this.logger.log('Rol admin creado');
    } else {
      this.logger.log('Rol admin ya existe');
    }

    // 2. Crear el usuario admin si no existe
    let usuarioAdmin = await usuarioRepo.findOneBy({ email: process.env.SEED_ADMIN_EMAIL });
    if (!usuarioAdmin) {
      const crypto = require('crypto');
      const hashedPassword = crypto.createHash('sha256').update(process.env.SEED_ADMIN_PASSWORD).digest('hex');
      usuarioAdmin = usuarioRepo.create({
        nombre: process.env.SEED_ADMIN_NOMBRE,
        apellido: process.env.SEED_ADMIN_APELLIDO,
        edad: 0,
        cedula: process.env.SEED_ADMIN_CEDULA,
        email: process.env.SEED_ADMIN_EMAIL,
        contrasena: hashedPassword,
        telefono: process.env.SEED_ADMIN_TELEFONO,
        imagen: '',
        estado: true,
        rol: rolAdmin,
        rol_id: rolAdmin.id_rol
      });
      await usuarioRepo.save(usuarioAdmin);
      this.logger.log('Usuario admin creado');
    } else {
      this.logger.log('Usuario admin ya existe');
    }
  } catch (err) {
    this.logger.error('Error ejecutando el seeder:', err);
  } finally {
    await app.close();
  }
}

bootstrap();
