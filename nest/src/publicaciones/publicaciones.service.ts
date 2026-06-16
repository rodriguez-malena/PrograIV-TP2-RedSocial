import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './schema/publicacion.schema';
import { Model } from 'mongoose';
import { PublicacionDto } from './dto/publicacion.dto';

@Injectable()
export class PublicacionesService {

    constructor(@InjectModel(Publicacion.name)
                private publicacionModel: Model<Publicacion>){}
    
    // Crear publicacion
    async crear(datos: PublicacionDto){
        const publicacion = new this.publicacionModel(datos)
        await publicacion.save()

        return publicacion;
    }

    // Listar publis
    async listar(){
        return this.publicacionModel.find({ eliminada: false}).sort({ fechaCreacion: -1}) 
        // Trae las publicaciones activas ordenadas desde la mas nueva
    }

    // Dar like
    async darLike(publicacionId: string, usuarioId: string){
        const publicacion =  await this.publicacionModel.findById(publicacionId);

        if(!publicacion){
            throw new NotFoundException('Publicación no encontrada')
        }

        if(publicacion.likes.includes(usuarioId)){
            throw new BadRequestException('Ya diste like');
        }

        publicacion.likes.push(usuarioId);

        await publicacion.save()

        return {
            message: 'Like agregado'
        };
    }
    
    async eliminarLike(publicacionId: string, usuarioId: string){
        const publicacion =  await this.publicacionModel.findById(publicacionId);

        if(!publicacion){
            throw new NotFoundException('Publicación no encontrada')
        }

       publicacion.likes = publicacion.likes.filter(like => like !== usuarioId) // filtra y borra del array el like de tal usuario

        await publicacion.save()

        return {
            message: 'Like eliminado'
        };

    }


}
