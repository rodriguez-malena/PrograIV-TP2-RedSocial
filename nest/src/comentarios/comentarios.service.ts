import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario } from './schema/comentario.schema';
import { Model } from 'mongoose';

@Injectable()
export class ComentariosService {

    constructor(@InjectModel(Comentario.name)
                private comentarioModel: Model<Comentario>){}


    async comentar(datos){

        const comentario = await this.comentarioModel.create({
            mensaje: datos.mensaje,
            usuario : datos.usuarioId,
            publicacion : datos.publicacionId,
            modificado: false
        })

        return comentario.populate('usuario')
    }

    async obtener(publicacionId: string, limit: number, offset: number){
       
        const filtro = { publicacion: publicacionId };
        
        const total = await this.comentarioModel.countDocuments(filtro);

        const comentarios = this.comentarioModel.find(filtro).populate('usuario').sort({ createdAt : -1 }).skip(Number(offset)).limit(Number(limit))
        
        return {
            comentarios,
            total
        }
    
    }

    async editar(id: string, datos){
        return this.comentarioModel.findByIdAndUpdate(id, { mensaje: datos.mensaje, modificado: true }, { new: true })
    }
}
