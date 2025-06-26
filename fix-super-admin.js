/**
 * Script para corregir el usuario Super Administrador y sus permisos
 * 
 * Este script:
 * 1. Crea el rol "Super Administrador" si no existe
 * 2. Crea o actualiza el usuario admin con la contraseña correcta
 * 3. Asigna todos los permisos necesarios
 */

const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// Configuración de la conexión a la base de datos
const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '1061',
  database: process.env.DB_NAME || 'boxware'
});

// Datos del Super Administrador desde variables de entorno
const SUPER_ADMIN_ROLE = process.env.SEED_ROLE_ADMIN || 'Super Administrador';
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'brand@admin.com';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'passwordd';
const ADMIN_NOMBRE = process.env.SEED_ADMIN_NOMBRE || 'brandonnn';
const ADMIN_APELLIDO = process.env.SEED_ADMIN_APELLIDO || 'gomezzzz';
const ADMIN_EDAD = process.env.SEED_ADMIN_EDAD || '15';
const ADMIN_CEDULA = process.env.SEED_ADMIN_CEDULA || '1083984508';
const ADMIN_TELEFONO = process.env.SEED_ADMIN_TELEFONO || '0000000000';

async function main() {
  try {
    console.log('Conectando a la base de datos...');
    await client.connect();
    
    // 1. Verificar y crear el rol Super Administrador
    console.log(`Verificando rol ${SUPER_ADMIN_ROLE}...`);
    let result = await client.query("SELECT * FROM rol WHERE nombre_rol = $1", [SUPER_ADMIN_ROLE]);
    
    let rolId;
    if (result.rows.length === 0) {
      console.log(`Creando rol ${SUPER_ADMIN_ROLE}...`);
      const insertRol = await client.query(`
        INSERT INTO rol (nombre_rol, descripcion, estado) 
        VALUES ($1, 'Administrador del sistema con acceso total', true)
        RETURNING id_rol
      `, [SUPER_ADMIN_ROLE]);
      rolId = insertRol.rows[0].id_rol;
      console.log(`Rol ${SUPER_ADMIN_ROLE} creado con ID: ${rolId}`);
    } else {
      rolId = result.rows[0].id_rol;
      console.log(`Rol ${SUPER_ADMIN_ROLE} ya existe con ID: ${rolId}`);
    }
    
    // 2. Verificar y crear/actualizar el usuario admin
    console.log(`Verificando usuario con email: ${ADMIN_EMAIL}...`);
    result = await client.query("SELECT * FROM usuario WHERE email = $1", [ADMIN_EMAIL]);
    
    const hashedPassword = crypto.createHash('sha256').update(ADMIN_PASSWORD).digest('hex');
    console.log(`Hash de contraseña generado: ${hashedPassword}`);
    
    let usuarioId;
    if (result.rows.length === 0) {
      console.log('Creando usuario admin...');
      const insertUsuario = await client.query(`
        INSERT INTO usuario (nombre, apellido, edad, cedula, email, contrasena, telefono, imagen, estado, rol_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, '', true, $8)
        RETURNING id_usuario
      `, [ADMIN_NOMBRE, ADMIN_APELLIDO, parseInt(ADMIN_EDAD), ADMIN_CEDULA, ADMIN_EMAIL, hashedPassword, ADMIN_TELEFONO, rolId]);
      usuarioId = insertUsuario.rows[0].id_usuario;
      console.log(`Usuario admin creado con ID: ${usuarioId}`);
    } else {
      usuarioId = result.rows[0].id_usuario;
      console.log(`Usuario admin ya existe con ID: ${usuarioId}`);
      
      // Actualizar la contraseña y el rol
      await client.query(`
        UPDATE usuario 
        SET contrasena = $1, rol_id = $2, nombre = $3, apellido = $4, edad = $5, cedula = $6, telefono = $7
        WHERE id_usuario = $8
      `, [hashedPassword, rolId, ADMIN_NOMBRE, ADMIN_APELLIDO, parseInt(ADMIN_EDAD), ADMIN_CEDULA, ADMIN_TELEFONO, usuarioId]);
      console.log('Usuario admin actualizado con la contraseña correcta y rol Super Administrador');
    }
    
    // 3. Verificar y crear módulos básicos
    console.log('Verificando módulos básicos...');
    const modulosBasicos = [
      { rutas: 'permisos', descripcion: 'Gestión de permisos' },
      { rutas: 'usuarios', descripcion: 'Gestión de usuarios' },
      { rutas: 'roles', descripcion: 'Gestión de roles' },
      { rutas: 'modulos', descripcion: 'Gestión de módulos' }
    ];
    
    for (const modulo of modulosBasicos) {
      result = await client.query("SELECT * FROM modulo WHERE rutas = $1", [modulo.rutas]);
      
      if (result.rows.length === 0) {
        console.log(`Creando módulo ${modulo.rutas}...`);
        await client.query(`
          INSERT INTO modulo (rutas, descripcion_ruta, estado) 
          VALUES ($1, $2, true)
        `, [modulo.rutas, modulo.descripcion]);
        console.log(`Módulo ${modulo.rutas} creado`);
      } else {
        console.log(`Módulo ${modulo.rutas} ya existe`);
      }
    }
    
    // 4. Asignar permisos al Super Administrador para todos los módulos
    console.log('Asignando permisos al Super Administrador...');
    const modulos = await client.query("SELECT * FROM modulo");
    
    for (const modulo of modulos.rows) {
      // Verificar si ya existe un permiso para este rol y módulo
      const permisoExistente = await client.query(
        "SELECT * FROM permiso WHERE rol_id = $1 AND modulo_id = $2",
        [rolId, modulo.id_modulo]
      );
      
      if (permisoExistente.rows.length === 0) {
        console.log(`Creando permiso para Super Administrador en módulo ${modulo.rutas}...`);
        await client.query(`
          INSERT INTO permiso (nombre, codigo_nombre, puede_ver, puede_crear, puede_actualizar, puede_eliminar, estado, modulo_id, rol_id) 
          VALUES ($1, $2, true, true, true, true, true, $3, $4)
        `, [
          `Permiso completo para ${modulo.rutas}`,
          `permiso_completo_${modulo.rutas.toLowerCase().replace(/ /g, '_')}`,
          modulo.id_modulo,
          rolId
        ]);
        console.log(`✅ Permiso creado para módulo ${modulo.rutas}`);
      } else {
        console.log(`Actualizando permiso para Super Administrador en módulo ${modulo.rutas}...`);
        await client.query(`
          UPDATE permiso 
          SET puede_ver = true, puede_crear = true, puede_actualizar = true, puede_eliminar = true 
          WHERE rol_id = $1 AND modulo_id = $2
        `, [rolId, modulo.id_modulo]);
        console.log(`✅ Permiso actualizado para módulo ${modulo.rutas}`);
      }
    }
    
    console.log('\n¡Script completado con éxito!');
    console.log('Ahora puedes iniciar sesión con:');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Contraseña: ${ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error('Error al ejecutar el script:', error);
  } finally {
    await client.end();
  }
}

main();
