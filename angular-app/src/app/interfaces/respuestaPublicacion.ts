import { Publicacion } from "./publicacion";


export interface RespuestaPublicacion {
  publicaciones: Publicacion[];
  total: number;
}