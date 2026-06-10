import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import cloudinary from '../cloudinary/cloudinary.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';



@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('registro')
    @UseInterceptors(
        FileInterceptor('imagenPerfil', {
            storage: new CloudinaryStorage({
                cloudinary,
                params: {
                    folder: 'red-social',
                    allowed_formats: ['jpg','jpeg','png']} as any
            })
        })
    )

    async registro(@UploadedFile() archivo: Express.Multer.File, @Body() body: RegistroDto){
        if(archivo){
            body.imagenPerfil = archivo.path
        }
        if (!archivo) {
            throw new BadRequestException('La foto de perfil es obligatoria');
        }

        try {
            return await this.authService.registrar(body)
            
        } catch(error) {
            if(archivo){
                await cloudinary.uploader.destroy('red-social/'+ archivo.filename)
            }
            throw error;
        }
    }

    @Post('login')
    login(@Body() body: LoginDto){
        return this.authService.login(body)
    }
}
