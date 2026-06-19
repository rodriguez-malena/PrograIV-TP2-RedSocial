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
    async listar(orden: 'fecha' | 'likes' = 'fecha', offset = 0, limit = 5){
        
        if(orden === 'likes'){
            console.log('ORDENANDO POR LIKES');
            
            return this.publicacionModel.find({ eliminada: false}).sort({ cantidadLikes: -1}).skip(offset).limit(limit)
        }

        console.log('ORDENANDO POR FECHA');
        return this.publicacionModel.find({ eliminada: false}).sort({ fechaCreacion: -1}).skip(offset).limit(limit)
        // Trae las publicaciones activas ordenadas desde la mas nueva x default
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
        publicacion.cantidadLikes = publicacion.likes.length;

        console.log(publicacion.likes);

        await publicacion.save()

        return publicacion;
    }
    
    async eliminarLike(publicacionId: string, usuarioId: string){
        const publicacion =  await this.publicacionModel.findById(publicacionId);

        if(!publicacion){
            throw new NotFoundException('Publicación no encontrada')
        }

        publicacion.likes = publicacion.likes.filter(like => like !== usuarioId) // filtra y borra del array el like de tal usuario
        
        publicacion.cantidadLikes = publicacion.likes.length;       
        console.log(publicacion.likes);

        await publicacion.save()

        return publicacion
        

    }

    async eliminar(publicacionId: string, usuarioId: string){
        const publicacion =  await this.publicacionModel.findById(publicacionId);
        
        if(!publicacion){
            throw new NotFoundException('Publicación no encontrada')
        }

        if(publicacion.usuarioId != usuarioId){
            throw new BadRequestException('No podes eliminar publicaciones que no te pertenecen!');

        }

        publicacion.eliminada = true;

        await publicacion.save();

        return {
            mensaje: "Publicación eliminada"
        }

    }
}
