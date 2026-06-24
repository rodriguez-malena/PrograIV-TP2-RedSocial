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
     
        return this.comentarioModel.find({ publicacion: publicacionId }).populate('usuario').sort({ createdAt : -1 }).skip(Number(offset)).limit(Number(limit))
    }

    async editar(id: string, datos){
        return this.comentarioModel.findByIdAndUpdate(id, { mensaje: datos.mensaje, modificado: true }, { new: true })
    }
}
