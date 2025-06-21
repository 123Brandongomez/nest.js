import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

/**
 * Middleware para asegurar que las carpetas de archivos estu00e1ticos existan
 */
@Injectable()
export class StaticFilesMiddleware implements NestMiddleware {
  /**
   * Constructor del middleware
   * @param directories Directorios a crear si no existen
   */
  constructor(private readonly directories: string[] = []) {}

  /**
   * Implementacion del middleware
   * @param req Solicitud HTTP
   * @param res Respuesta HTTP
   * @param next Funciou00f3n para continuar con el siguiente middleware
   */
  use(req: Request, res: Response, next: NextFunction) {
    // Crear directorios si no existen
    this.directories.forEach(dir => {
      const fullPath = path.resolve(dir);
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
      }
    });

    next();
  }
}
