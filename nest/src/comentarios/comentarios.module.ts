import { Module } from '@nestjs/common';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { Comentario, ComentarioSchema } from './schema/comentario.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[MongooseModule.forFeature([{ name:Comentario.name , schema: ComentarioSchema }]),
          AuthModule],
  controllers: [ComentariosController],
  providers: [ComentariosService]
})
export class ComentariosModule {}
