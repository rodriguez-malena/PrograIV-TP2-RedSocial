import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorageCloudinary } from '../cloudinary/cloudinary.storage';
import { PublicacionDto } from './dto/publicacion.dto';
import { PublicacionesService } from './publicaciones.service';
import cloudinary from '../cloudinary/cloudinary.config';

@Controller('publicaciones')
export class PublicacionesController {
    constructor(private publicacionService: PublicacionesService){}

    @Post()
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: crearStorageCloudinary('red-social-publicaciones')
        })
    )

    async subirPublicacion(@UploadedFile() publicacion: Express.Multer.File, @Body() body: PublicacionDto){
        if(publicacion){
            body.imagen = publicacion.path
        }
        if (!publicacion) {
            throw new BadRequestException('La imagen es obligatoria');
        }
       
        try {
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
    obtenerPublicaciones(@Query('orden') orden: 'fecha' | 'likes'){
        console.log('Controller: ', orden);
        
        return this.publicacionService.listar(orden);

    }

    @Delete(':id') 
    borrarPublicacion(){

    }

    @Post(':id/like')
    darLike(@Param('id') publicacionId: string, @Body('usuarioId') usuarioId: string){
        return this.publicacionService.darLike(publicacionId, usuarioId)
    }

    @Delete(':id/like')
    eliminarLike(@Param('id') publicacionId: string, @Body('usuarioId') usuarioId: string){
        return this.publicacionService.eliminarLike(publicacionId, usuarioId)
    }


}
