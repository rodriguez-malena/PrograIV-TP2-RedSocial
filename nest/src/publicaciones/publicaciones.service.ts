import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './schema/publicacion.schema';
import { Model } from 'mongoose';
import { PublicacionDto } from './dto/publicacion.dto';

@Injectable()
export class PublicacionesService {

    constructor(@InjectModel(Publicacion.name)
                private publicacionModel: Model<Publicacion>){}

    async crear(datos: PublicacionDto){
        const publicacion = new this.publicacionModel(datos)
        await publicacion.save()
        return {
            message: 'Publicación creada'
        };
    }

    async listar(){
        return this.publicacionModel.find({ eliminada: false}).sort({ fechaCreacion: -1}) 
        // Trae las publicaciones activas ordenadas desde la mas nueva
    }
}
