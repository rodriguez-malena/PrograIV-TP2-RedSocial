import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  registro(datos: any){
    return this.http.post(`${this.url}/auth/registro`, datos, { withCredentials: true })
  }

  login(datos: any){
    return this.http.post(`${this.url}/auth/login`, datos, { withCredentials: true } )
  }

  logout(){
    return this.http.post(`${this.url}/auth/logout`, {}, { withCredentials: true })
  }

  autorizar() {
    return this.http.post(`${this.url}/auth/autorizar`, {}, { withCredentials: true })
  }

  refrescar(){
    return this.http.post(`${this.url}/auth/refrescar`, {}, { withCredentials: true })
  }

}
