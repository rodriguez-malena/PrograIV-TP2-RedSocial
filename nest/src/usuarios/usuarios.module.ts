import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario, UsuarioSchema } from './schema/usuario.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema}])],
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
