import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
export class EstadisticasController {

    constructor(private estadisticasService: EstadisticasService){}

    @Get('publicaciones')
    publicacionesPorUsuario(@Req() req: Request, @Query('desde') desde: string, @Query('hasta') hasta: string){
        return this.estadisticasService.publicacionesPorUsuario(req.cookies.token, desde, hasta);
    }

    @Get('comentarios')
    comentariosPorTiempo(@Req() req: Request, @Query('desde') desde: string, @Query('hasta') hasta: string){
        return this.estadisticasService.comentariosPorTiempo(req.cookies.token, desde, hasta)
    }

    @Get('comentarios-publicaciones')
    comentariosPorPublicacion(@Req() req: Request,  @Query('desde') desde: string, @Query('hasta') hasta: string){
        return this.estadisticasService.comentariosPorPublicacion(req.cookies.token, desde, hasta);


    }
    

}
