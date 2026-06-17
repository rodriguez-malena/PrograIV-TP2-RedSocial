import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Publicacion } from '../interfaces/publicacion';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  crear(datos: FormData){
    return this.http.post<Publicacion>(`${this.url}/publicaciones`, datos)
  }
  
  obtener(orden: 'fecha' | 'likes'){
    return this.http.get<Publicacion[]>(`${this.url}/publicaciones?=${orden}`)
  }

  darLike(publicacionId: string, usuarioId: string){
    return this.http.post<Publicacion>(`${this.url}/publicaciones/${publicacionId}/like`, { usuarioId })
  }

  borrarLike(publicacionId: string, usuarioId: string){
    return this.http.delete<Publicacion>(`${this.url}/publicaciones/${publicacionId}/like`,
      {
        body: { usuarioId }
      }
    )
  }
}
