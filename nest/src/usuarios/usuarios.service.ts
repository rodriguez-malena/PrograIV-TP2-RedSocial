import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schema/usuario.schema';
import { AuthService } from '../auth/auth.service';



@Injectable()
export class UsuariosService {

    constructor(@InjectModel(Usuario.name)
                private usuarioModel: Model<Usuario>,
                private authService: AuthService){}


    async obtenerUsuarios(token: string){
        await this.authService.verificarAdmin(token)
        return  this.usuarioModel.find().select('-password');
    }

    async actualizarUsuario(id: string, datos: any){

        return await this.usuarioModel.findByIdAndUpdate(id, datos, { new: true}).select('-password')
    }

    async deshabilitar(id: string, token: string){
        
        await this.authService.verificarAdmin(token);

        const usuario =  await this.usuarioModel.findById(id);

        if(!usuario){
            throw new NotFoundException('Usuario no encontrado');

        }

        usuario.habilitado = false;

        await usuario.save();

        return {
            message: 'Usuario deshabilitado correctamente'
        }

    }

    async habilitar(id: string, token: string){
        await this.authService.verificarAdmin(token);

        const usuario =  await this.usuarioModel.findById(id);

        if(!usuario){
            throw new NotFoundException('Usuario no encontrado');
        }

        if(usuario.habilitado){
            return {
                message: 'El usuario ya se encuentra habilitado'
            };
        }
        
        usuario.habilitado = true;
        await usuario.save();

        return {
            message: 'Usuario habilitado correctamente'
        }


    }
}
