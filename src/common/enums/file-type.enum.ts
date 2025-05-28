/**
 * Enum para los tipos de archivos permitidos
 */
export enum FileType {
  /**
   * Archivos de imagen (jpg, jpeg, png, gif, webp)
   */
  IMAGE = 'image',
  
  /**
   * Archivos de documento (pdf, doc, docx, xls, xlsx, ppt, pptx, txt)
   */
  DOCUMENT = 'document',
  
  /**
   * Cualquier tipo de archivo
   */
  ANY = 'any',
}
