import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PublicacionService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  crear(datos: FormData){
    return this.http.post(`${this.url}/publicaciones`, datos)
  }
  
  obtener(){
    return this.http.get(`${this.url}/publicaciones`)
  }

  darLike(publicacionId: string, usuarioId: string){
    return this.http.post(`${this.url}/publicaciones/${publicacionId}/like`, usuarioId)
  }

  borrarLike(publicacionId: string, usuarioId: string){
    return this.http.delete(`${this.url}/publicaciones/${publicacionId}/like`,
      {
        body: { usuarioId }
      }
    )
  }
}
