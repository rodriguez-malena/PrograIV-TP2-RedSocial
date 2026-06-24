import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '15m'}
  }), 
  UsuariosModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})

export class AuthModule {}
