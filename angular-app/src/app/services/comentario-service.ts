import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ComentarioService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}


  
  obtenerComentarios(publicacionId: string , offset: number, limit: number){
    
    let url = `${this.url}/comentarios/${publicacionId}?&offset=${offset}&limit=${limit}`
  
    return this.http.get(url)
  
  }

  crearComentario(datos: any){
    return this.http.post( `${this.url}/comentarios`,datos)

  }

  editarComentario(id:string, datos: {mensaje: string}){
    return this.http.put( `${this.url}/comentarios/${id}`, datos)
  }
}
