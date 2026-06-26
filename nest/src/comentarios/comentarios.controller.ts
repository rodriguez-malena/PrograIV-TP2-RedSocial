import { Body, Controller, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';

@Controller('comentarios')
export class ComentariosController {
    constructor(private comentariosService: ComentariosService){}

    @Post()
    crearComentario(@Req() req, @Body() body){
        return this.comentariosService.comentar(body, req.cookies.token)
    }

    @Get(':publicacionId')
    obtenerComentarios(@Param('publicacionId') publicacionId: string, @Query('limit') limit = 5, @Query('offset') offset = 0){
        return this.comentariosService.obtener(publicacionId,limit,offset)
    }


    @Put(':id')
    editarComentario(@Req() req, @Param('id') id: string, @Body() body: { mensaje: string }){
        return this.comentariosService.editar(id, body, req.cookies.token)

    }
}

