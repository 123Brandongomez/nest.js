import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Importar componentes comunes
import { FileExceptionFilter, HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { APP_CONSTANTS } from './common/constants';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Asegurar que las carpetas de imágenes existan
  const imagesPaths = [
    APP_CONSTANTS.IMAGES_PATHS.MATERIALES,
    APP_CONSTANTS.IMAGES_PATHS.USUARIOS
  ];
  
  // Crear las carpetas si no existen
  imagesPaths.forEach(path => {
    const fullPath = join(__dirname, '..', path);
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true });
    }
  });

  // Configurar rutas estáticas para archivos
  app.useStaticAssets(join(__dirname, '..', APP_CONSTANTS.IMAGES_PATHS.MATERIALES), {
    prefix: APP_CONSTANTS.IMAGES_BASE_URLS.MATERIALES + '/',
  });
  
  app.useStaticAssets(join(__dirname, '..', APP_CONSTANTS.IMAGES_PATHS.USUARIOS), {
    prefix: APP_CONSTANTS.IMAGES_BASE_URLS.USUARIOS + '/',
  });

  // Configurar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, 
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    disableErrorMessages: false, 
  }));
  
  // Añadir filtros globales para excepciones
  app.useGlobalFilters(
    new FileExceptionFilter(),
    new HttpExceptionFilter()
  );
  
  // Añadir interceptor global para transformar respuestas
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
