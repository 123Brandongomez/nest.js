import { DynamicModule, Module, Provider } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImagenesConfig } from '../interfaces/imagenes-config.interface';
import { FileHelper } from '../utils/file-helper.util';
import { ImagenesService } from '../services/imagenes.service';
import { existsSync, mkdirSync } from 'fs';

/**
 * Módulo reutilizable para el manejo de imágenes
 */
@Module({})
export class ImagenesModule {
  /**
   * Registra el módulo de imágenes con una configuración personalizada
   * @param config Configuración para el módulo de imágenes o ruta de destino
   * @returns Módulo dinámico configurado
   */
  static register(config: ImagenesConfig | string): DynamicModule {
    // Convertir string a config si es necesario (para compatibilidad)
    const imagenesConfig = typeof config === 'string' 
      ? { destinationPath: config } 
      : config;
    
    // Asegurar que el directorio de destino exista
    FileHelper.ensureDirectoryExists(imagenesConfig.destinationPath);
    
    // Crear instancia del servicio para configurar Multer
    const imagenesService = new ImagenesService();
    
    // Obtener opciones de Multer del servicio
    const multerOptions = imagenesService.getMulterOptions(imagenesConfig);
    
    return {
      module: ImagenesModule,
      imports: [
        MulterModule.register({
          storage: diskStorage({
            destination: imagenesConfig.destinationPath,
            filename: (req, file, cb) => {
              const fileName = FileHelper.generateFileName(file.originalname);
              cb(null, fileName);
            },
          }),
          ...multerOptions,
        }),
      ],
      providers: [ImagenesService],
      exports: [MulterModule, ImagenesService],
    };
  }
}
