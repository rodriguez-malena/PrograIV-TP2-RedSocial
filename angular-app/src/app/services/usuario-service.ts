import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  obtenerUsuarios(){   
    return this.http.get<Usuario[]>(`${this.url}/usuarios/`, { withCredentials: true })
  
  }

  crearUsuario(datos: any) {
    return this.http.post<Usuario>(`${this.url}/usuarios`,datos, { withCredentials: true });
  }

  actualizarUsuario(usuarioId: string, datos: any){
    return this.http.put<Usuario>(`${this.url}/usuarios/${usuarioId}`, datos, {withCredentials: true});
  }


  deshabilitarUsuario(usuarioId: string){
    return this.http.delete(`${this.url}/usuarios/${usuarioId}`, { withCredentials: true })
  }

  habilitarUsuario(usuarioId: string){
    return this.http.post(`${this.url}/usuarios/${usuarioId}/habilitar`,{}, { withCredentials: true })
  }


}

