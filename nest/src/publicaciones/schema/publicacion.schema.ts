import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema()
export class Publicacion extends Document {

    @Prop({ required: true })
    titulo: string;
    
    @Prop({ required: true })
    descripcion: string;

    @Prop({ required: true })
    imagen: string;
    
    @Prop({ required: true })
    usuarioId: string;

    @Prop({ default: Date.now  })
    fechaCreacion: Date;

   @Prop({ required: true })
    nombreUsuario: string;

    @Prop({ default: [] })
    likes: string[];

    @Prop({ default: false })
    eliminada: boolean;

    @Prop({
    type: [
      {
        usuarioId: String,
        nombreUsuario: String,
        comentario: String,
        fecha: Date
      }
    ],
    default: []
  })
  comentarios: any[];

}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);