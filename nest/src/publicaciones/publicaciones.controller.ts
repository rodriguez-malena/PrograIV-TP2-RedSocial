import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorageCloudinary } from '../cloudinary/cloudinary.storage';
import { PublicacionDto } from './dto/publicacion.dto';
import { PublicacionesService } from './publicaciones.service';
import cloudinary from '../cloudinary/cloudinary.config';
import { AuthService } from '../auth/auth.service';
import type { Request } from 'express';


@Controller('publicaciones')
export class PublicacionesController {
    constructor(private publicacionService: PublicacionesService,
                private authService: AuthService){}

    @Post()
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: crearStorageCloudinary('red-social-publicaciones')
        })
    )

    async subirPublicacion(@Req() req: Request, @UploadedFile() publicacion: Express.Multer.File, @Body() body: PublicacionDto){
        if(publicacion){
            body.imagen = publicacion.path
        }
        if (!publicacion) {
            throw new BadRequestException('La imagen es obligatoria');
        }
       
        try {
            const usuario = await this.authService.autorizar(req.cookies.token);

            body.usuarioId = usuario._id.toString();
            body.nombreUsuario = usuario.nombreUsuario;
            body.imagenPerfil = usuario.imagenPerfil;
            
            return await this.publicacionService.crear(body)
        } 
        catch(error) {
            if(publicacion){
                await cloudinary.uploader.destroy('red-social-publicaciones/'+ publicacion.filename)
            }
            throw error;
        }
    }

    @Get()
    obtenerPublicaciones(@Req() req: Request ,@Query('orden') orden: 'fecha' | 'likes', @Query('offset') offset = 0, @Query('limit') limit = 5, @Query('usuarioId') usuarioId?: string){
        return this.publicacionService.listar(orden, Number(offset), Number(limit), usuarioId, req.cookies.token);

    }

    @Delete(':id') 
    borrarPublicacion(@Req() req: Request, @Param('id') publicacionId: string){
        return this.publicacionService.eliminar(publicacionId, req.cookies.token)
    }

    @Post(':id/like')
    async darLike(@Req() req: Request, @Param('id') publicacionId: string){
        
        const usuario = await this.authService.autorizar(req.cookies.token);
        
        return this.publicacionService.darLike(publicacionId, usuario._id.toString())
    }

    @Delete(':id/like')
    async eliminarLike(@Req() req: Request, @Param('id') publicacionId: string){

        const usuario = await this.authService.autorizar(req.cookies.token);

        return this.publicacionService.eliminarLike(publicacionId, usuario._id.toString())
    }


}
