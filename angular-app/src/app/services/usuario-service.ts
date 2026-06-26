import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  obtenerUsuarios(){   
    return this.http.get(`${this.url}/usuarios/`, { withCredentials: true })
  
  }

  actualizarUsuario(usuarioId: string, datos: any){
    return this.http.put(`${this.url}/usuarios/${usuarioId}`, datos, {withCredentials: true});
  }


  deshabilitarUsuario(usuarioId: string){
    return this.http.delete(`${this.url}/usuarios/${usuarioId}`, { withCredentials: true })
  }

  habilitar(usuarioId: string){
    return this.http.post(`${this.url}/usuarios/${usuarioId}/habilitar`,{}, { withCredentials: true })
  }
}

