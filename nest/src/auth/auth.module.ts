import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuarios/schema/usuario.schema';

@Module({
  imports:[
    JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1m'}
  }),

    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema,
      },
    ]), 
  ],

  controllers: [AuthController],
  providers: [AuthService]
})

export class AuthModule {}
