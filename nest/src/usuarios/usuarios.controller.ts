import { Controller, Get, Put, Param, Body, UseInterceptors, UploadedFile, Req, Delete, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { crearStorageCloudinary } from '../cloudinary/cloudinary.storage';
import type { Request } from 'express';


@Controller('usuarios')
export class UsuariosController {
    constructor(private usuarioService: UsuariosService){}

    @Get()
    obtenerUsuarios(@Req() req: Request) {
        return this.usuarioService.obtenerUsuarios(req.cookies.token);
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

    @Delete(':id')
    deshabilitarUsuario(@Req() req: Request, @Param('id') id: string){
        return this.usuarioService.deshabilitar(id, req.cookies.token)
    }

    @Post(':id')
    habilitarUsuario(@Req() req: Request, @Param('id') id: string){

    }

}
