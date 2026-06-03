import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuarios/schema/usuario.schema';


@Module({
  imports:[MongooseModule.forFeature([{ name:Usuario.name , schema: UsuarioSchema }])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
