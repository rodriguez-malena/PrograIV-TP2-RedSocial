import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Usuario } from '../usuarios/schema/usuario.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    
    constructor(@InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>){}
    
    async registrar(datos: RegistroDto){

        const existeEmail = await this.usuarioModel.findOne({
            email: datos.email
        });

        const existerUsuario = await this.usuarioModel.findOne({
            nombreUsuario: datos.nombreUsuario
        });

        if(existeEmail){
            throw new ConflictException(
                'El email ya esta registrado'
            )
        }

        if(existerUsuario){
            throw new ConflictException(
                'El nombre de usuario ya existe'
            )
        }

        const encriptada = await bcrypt.hash(datos.password, 10)

        const usuario = new this.usuarioModel({
            ...datos,
            password: encriptada
        });

        await usuario.save();

        return {
            message: 'Usuario creado!'
        }
    }
    
    async login(datos: LoginDto){
        const usuarioLogueado = await this.usuarioModel.findOne({
            nombreUsuario: datos.nombreUsuario
        });
        
        console.log(usuarioLogueado);


        if(!usuarioLogueado){
            throw new UnauthorizedException('Este usuario no existe');
        }

        const passwordCorrecta = await bcrypt.compare(datos.password,usuarioLogueado.password);

        console.log(passwordCorrecta);


        if(!passwordCorrecta){
            throw new UnauthorizedException('Contraseña incorrecta');
        }
        

        const usuarioSinPassword: any = usuarioLogueado.toObject();
        
        delete usuarioSinPassword.password;

        return {
            message: 'Login exitoso',
            usuario: usuarioSinPassword
            }
    }



    
}
