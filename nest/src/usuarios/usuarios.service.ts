import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './schema/usuario.schema';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from './dto/usuario.dto';


@Injectable()
export class UsuariosService {

    constructor(@InjectModel(Usuario.name)
                private usuarioModel: Model<Usuario>,
                private authService: AuthService){}


    async obtenerUsuarios(token: string){
        await this.authService.verificarAdmin(token)
        return  this.usuarioModel.find().select('-password');
    }


    async crearUsuario(datos: UsuarioDto, token: string) {

        await this.authService.verificarAdmin(token);

        const usuarioExistente = await this.usuarioModel.findOne({ email: datos.email });

        if (usuarioExistente) {
            throw new ConflictException('El email ya está registrado');
        }

        const encriptada = await bcrypt.hash(datos.password, 10);

        const nuevoUsuario = new this.usuarioModel({
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            nombreUsuario: datos.nombreUsuario,
            password: encriptada,
            fechaNacimiento: datos.fechaNacimiento,
            descripcion: datos.descripcion,
            imagenPerfil: datos.imagenPerfil,
            perfil: datos.perfil || 'usuario',
            habilitado: true
        });

        await nuevoUsuario.save()
        
        const usuarioObj = nuevoUsuario.toObject();

        const { password, ...usuarioSinPassword } = usuarioObj;

        return {
            message: 'Usuario creado!',
            usuario: usuarioSinPassword
        }
    }

    async actualizarUsuario(id: string, datos: any, token: string){
        const usuarioLogueado = await this.authService.autorizar(token);
        const usuario =  await this.usuarioModel.findById(id);

        if(!usuario){
            throw new NotFoundException('Usuario no encontrado');

        }

        if(usuarioLogueado.perfil !== 'admin' && usuario._id.toString() !== usuarioLogueado._id.toString()){
            throw new UnauthorizedException ('No tenes permisos para editar este perfil')
        }
        
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
