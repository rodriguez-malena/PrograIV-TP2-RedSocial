import { BadRequestException, Body, Controller, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import cloudinary from '../cloudinary/cloudinary.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorageCloudinary } from '../cloudinary/cloudinary.storage';
import type { Request, Response } from 'express';

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 1 * 60 * 1000,
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('registro')
    @UseInterceptors(
        FileInterceptor('imagenPerfil', {
            storage: crearStorageCloudinary('red-social')})
    )

    async registro(@UploadedFile() archivo: Express.Multer.File, @Body() body: RegistroDto, @Res({ passthrough: true }) res: Response){
        if(archivo){
            body.imagenPerfil = archivo.path
        }
        if (!archivo) {
            throw new BadRequestException('La foto de perfil es obligatoria');
        }

        try {
            const respuesta = await this.authService.registrar(body);
            
            res.cookie('token', respuesta.token, cookieOptions)

        return {
            message: respuesta.message,
            usuario: respuesta.usuario
        }
            
        } catch(error) {
            if(archivo){
                await cloudinary.uploader.destroy('red-social/'+ archivo.filename)
            }
            throw error;
        }
    }

    @Post('login')
    async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response){
        
        const respuesta = await this.authService.login(body)
        
        res.cookie('token', respuesta.token, cookieOptions)

        return {
            message: respuesta.message,
            usuario: respuesta.usuario
        }
        
    }

    @Post('autorizar')
    autorizar(@Req() req: Request){
        return this.authService.autorizar(req.cookies.token);
    }

    @Post('refrescar')
    async refrescar(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        
        console.log('COOKIE TOKEN:', req.cookies.token);

        const respuesta = await this.authService.refrescar(req.cookies.token)
        
        res.cookie('token', respuesta.token, cookieOptions)

        return {
            message: 'Token actualizado'
        }
    
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response){

        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });

        return {
            message: 'Sesión cerrada'
        }
    }
}
