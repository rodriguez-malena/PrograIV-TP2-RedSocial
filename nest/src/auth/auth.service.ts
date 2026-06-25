import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegistroDto } from './dto/registro.dto';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Usuario } from '../usuarios/schema/usuario.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    
    constructor(private jwtService: JwtService,
                @InjectModel(Usuario.name)
                private usuarioModel: Model<Usuario>){}
    
    async registrar(datos: RegistroDto){

        const existeEmail = await this.usuarioModel.findOne({ email: datos.email });

        const existeUsuario = await this.usuarioModel.findOne({ nombreUsuario: datos.nombreUsuario });

        if(existeEmail){
            throw new ConflictException(
                'El email ya esta registrado'
            )
        }

        if(existeUsuario){
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

        // Genero token
        const payload = {
            sub: usuario._id,
            email: usuario.email,
            username: usuario.nombreUsuario,
            rol: usuario.perfil
        }
        
        const token = this.jwtService.sign(payload, { expiresIn: '60s'})
        
        const usuarioObj = usuario.toObject();

        const { password, ...usuarioSinPassword } = usuarioObj;

        return {
            message: 'Usuario creado!',
            token,
            usuario: usuarioSinPassword
        }
    }
    
    async login(datos: LoginDto){

        const usuarioLogueado = await this.usuarioModel.findOne({ nombreUsuario: datos.nombreUsuario });

        if(!usuarioLogueado){
            throw new UnauthorizedException('Este usuario no existe');
        }

        const passwordCorrecta = await bcrypt.compare(datos.password,usuarioLogueado.password);

        console.log(passwordCorrecta);


        if(!passwordCorrecta){
            throw new UnauthorizedException('Contraseña incorrecta');
        }
        
        const payload = {
            sub: usuarioLogueado._id,
            email: usuarioLogueado.email,
            username: usuarioLogueado.nombreUsuario,
            rol: usuarioLogueado.perfil
        }

        const token = this.jwtService.sign(payload, { expiresIn: '60s'})

        const usuarioObj = usuarioLogueado.toObject();
        const { password, ...usuarioSinPassword } = usuarioObj;

        return {
            message: 'Login exitoso',
            token,
            usuario: usuarioSinPassword
            }
    }


    async autorizar(token: string) {
    try {
        const payload = this.jwtService.verify(token); //validación del token y de la expiracion, devuelvbe payload si cumple

        const usuario = await this.usuarioModel.findById(payload.sub).select('-password')       

        return usuario;

    } catch (err) {
        throw new UnauthorizedException('Token inválido o vencido');
    }
    }

    async refrescar(token: string){
        try {
            const payload = this.jwtService.verify(token);

            const newPayload = {
            sub: payload.sub,
            email: payload.email,
            username: payload.username,
            rol: payload.rol
            };

            return {
                token: this.jwtService.sign(newPayload, {
                    expiresIn: '120s'
                })
            };

        } catch (e) {
            throw new UnauthorizedException('No se pudo refrescar el token');
        }
    }
    
}
