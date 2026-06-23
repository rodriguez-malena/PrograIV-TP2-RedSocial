import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}


  actualizarUsuario(usuarioId:string, datos:any){
    return this.http.put(`${this.url}/usuarios/${usuarioId}`, datos
    );
}
}
