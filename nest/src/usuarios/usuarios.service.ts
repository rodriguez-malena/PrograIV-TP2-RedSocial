import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schema/usuario.schema';



@Injectable()
export class UsuariosService {

    constructor(@InjectModel(Usuario.name)
                private usuarioModel: Model<Usuario>){}

    async obtenerUsuarios(){
        return await this.usuarioModel.find().select('-password');
    }
}
