import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';


export function crearStorageCloudinary(carpeta: string) {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: carpeta,
      allowed_formats: ['jpg', 'jpeg', 'png']
    } as any
  });
}