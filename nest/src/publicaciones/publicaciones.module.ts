import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from './schema/publicacion.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name:Publicacion.name , schema: PublicacionSchema }])],
  providers: [PublicacionesService],
  controllers: [PublicacionesController]
})
export class PublicacionesModule {}
