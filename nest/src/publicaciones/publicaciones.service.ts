import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './schema/publicacion.schema';
import { Model } from 'mongoose';
import { PublicacionDto } from './dto/publicacion.dto';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class PublicacionesService {

    constructor(@InjectModel(Publicacion.name)
                private publicacionModel: Model<Publicacion>,
                private authService: AuthService){}
    
    // Crear publicacion
    async crear(datos: PublicacionDto){
        const publicacion = new this.publicacionModel(datos)
        await publicacion.save()

        return publicacion;
    }

    // Listar publis
    async listar(orden: 'fecha' | 'likes' = 'fecha', offset = 0, limit = 5,   usuarioId?: string, token?: string){
        
        const usuario = token ? await this.authService.autorizar(token): null
        
        const esAdmin = usuario?.perfil === 'admin';

        const filtro : any = {};
        //const filtro : any = { eliminada : false};

         if (!esAdmin) {
            filtro.eliminada = false;
        }

        if(usuarioId){
            filtro.usuarioId = usuarioId;
        }

        const total = await this.publicacionModel.countDocuments(filtro);
        
        let criterioDeOrden;

        if (orden === 'likes') {
        criterioDeOrden = { cantidadLikes: -1 };
        } else {
        criterioDeOrden = { fechaCreacion: -1 };
        }     

        const publicaciones = await this.publicacionModel.find(filtro).sort(criterioDeOrden).skip(offset).limit(limit);
        
        return {
            publicaciones,
            total
        }
        

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

        await publicacion.save()

        return publicacion
        

    }

    async eliminar(publicacionId: string, token: string){
        const publicacion =  await this.publicacionModel.findById(publicacionId);
        const usuario = await this.authService.autorizar(token);

        if(!publicacion){
            throw new NotFoundException('Publicación no encontrada')
        }

        // No permite borrar si no es admin o el usuario
        if(usuario.perfil !== 'admin' && publicacion.usuarioId.toString() !== usuario._id.toString()){
            throw new BadRequestException('No podes eliminar publicaciones que no te pertenecen!');

        }

        publicacion.eliminada = true;

        await publicacion.save();

        return {
            mensaje: "Publicación eliminada"
        }

    }
}
