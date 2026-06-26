import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './schema/comentario.schema';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ComentariosService {

    constructor(@InjectModel(Comentario.name)
                private comentarioModel: Model<Comentario>,
                private authService: AuthService){}


    async comentar(datos, token: string){
        const usuario = await this.authService.autorizar(token);
        
        const comentario = await this.comentarioModel.create({
            mensaje: datos.mensaje,
            usuario : usuario._id,
            publicacion : datos.publicacionId,
            modificado: false
        })

        return comentario.populate('usuario')
    }

    async obtener(publicacionId: string, limit: number, offset: number){
       
        const filtro = { publicacion: publicacionId };

        const total = await this.comentarioModel.countDocuments(filtro);

        const comentarios = await this.comentarioModel.find(filtro).populate('usuario').sort({ createdAt : -1 }).skip(Number(offset)).limit(Number(limit))
        
        return {
            comentarios,
            total
        }
    
    }

    async editar(id: string, datos, token: string){

        const usuario = await this.authService.autorizar(token);

        const comentario = await this.comentarioModel.findById(id);

        if (!comentario) {
            throw new NotFoundException('Comentario no encontrado');
        }

        if (comentario.usuario.toString() !== usuario._id.toString()) {
            throw new UnauthorizedException('No podés editar este comentario');
        }


        return this.comentarioModel.findByIdAndUpdate(id, { mensaje: datos.mensaje, modificado: true }, { new: true })
    }
}
