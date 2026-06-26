import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Publicacion } from '../interfaces/publicacion';
import { RespuestaPublicacion } from '../interfaces/respuestaPublicacion';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  crear(datos: FormData){
    return this.http.post<Publicacion>(`${this.url}/publicaciones`, datos,  { withCredentials: true })
  }
  
  obtener(orden: 'fecha' | 'likes', offset: number, limit: number, usuarioId?: string){
    
    let url = `${this.url}/publicaciones?orden=${orden}&offset=${offset}&limit=${limit}`
    
    if(usuarioId){
      url += `&usuarioId=${usuarioId}`
    }

    return this.http.get<RespuestaPublicacion>(url)
  
  }

  darLike(publicacionId: string){
    return this.http.post<Publicacion>(`${this.url}/publicaciones/${publicacionId}/like`, {}, { withCredentials: true })
  }

  borrarLike(publicacionId: string){
    return this.http.delete<Publicacion>(`${this.url}/publicaciones/${publicacionId}/like`, { withCredentials: true })
  }

  eliminar(publicacionId: string){
    return this.http.delete(`${this.url}/publicaciones/${publicacionId}`, { withCredentials: true })
  }
  


}
