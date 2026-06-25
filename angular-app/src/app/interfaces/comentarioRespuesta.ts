import { Comentario } from "./comentario";

export interface RespuestaComentarios {
  
    comentarios: Comentario[];
    total: number;
}