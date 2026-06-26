import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Usuario extends Document {

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  nombreUsuario: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  fechaNacimiento: Date;

  @Prop()
  descripcion: string;

  @Prop()
  imagenPerfil: string;

  @Prop({ default: 'usuario' })
  perfil: string;

  @Prop({ default: true })
  habilitado: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);