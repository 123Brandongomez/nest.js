import { Module, DynamicModule } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({})
export class ImagenesModule {
  static register(destination: string): DynamicModule {
    return {
      module: ImagenesModule,
      imports: [
        MulterModule.register({
          storage: diskStorage({
            destination: destination, 
            filename: (req, file, callback) => {
              const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`; 
              callback(null, uniqueName);
            },
          }),
          fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
              return callback(new Error('Solo se permiten archivos de imagen'), false);
            }
            callback(null, true);
          },
        }),
      ],
      exports: [MulterModule],
    };
  }
}
