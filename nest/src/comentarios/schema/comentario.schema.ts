import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { timestamp } from "rxjs";


@Schema ({ timestamps: true})
export class Comentario {
    @Prop()
    mensaje: string
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'})
    usuario: string;
    
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion'})
    publicacion: string;
    
    @Prop({ default: Date.now  })
    fecha: Date;
        
    @Prop({ default: false })
    modificado: boolean;

}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);