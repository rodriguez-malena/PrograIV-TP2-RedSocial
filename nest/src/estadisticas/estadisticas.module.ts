import { Module } from '@nestjs/common';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from '../publicaciones/schema/publicacion.schema';
import { Comentario, ComentarioSchema } from '../comentarios/schema/comentario.schema';
import { Usuario, UsuarioSchema } from '../usuarios/schema/usuario.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[MongooseModule.forFeature([
    { name: Publicacion.name, schema: PublicacionSchema },
    { name: Comentario.name, schema: ComentarioSchema },
    { name: Usuario.name, schema: UsuarioSchema }
  ]),
  AuthModule],
  controllers: [EstadisticasController],
  providers: [EstadisticasService]
})
export class EstadisticasModule {}
