import { Controller, Get, Put, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorageCloudinary } from '../cloudinary/cloudinary.storage';


@Controller('usuarios')
export class UsuariosController {
    constructor(private usuarioService: UsuariosService){}

    @Get()
    obtenerUsuarios() {
        return this.usuarioService.obtenerUsuarios();
    }

    @Put(':id')
    @UseInterceptors(
        FileInterceptor('imagenPerfil',{
        storage: crearStorageCloudinary('red-social-perfiles')
    })
    )

    async actualizarUsuario(@Param('id') id: string, @UploadedFile() archivo: Express.Multer.File, @Body() body: any){
        
        if(archivo){
            body.imagenPerfil = archivo.path;
        }
        
        return this.usuarioService.actualizarUsuario(id, body);
    }
}
