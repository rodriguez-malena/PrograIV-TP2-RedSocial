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

    @Prop({ timestamps: true  })
    fechaCreacion: Date;

   @Prop({ required: true })
    nombreUsuario: string;

    @Prop({ default: [] })
    likes: string[];

    @Prop({ default: 0 })
    cantidadLikes: number;

    @Prop({ required: true })
    imagenPerfil: string;

    @Prop({ default: false })
    eliminada: boolean;


}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);