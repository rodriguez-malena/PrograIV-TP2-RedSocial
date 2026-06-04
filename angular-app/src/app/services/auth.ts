import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly url = 'https://angular-nest-eight.vercel.app' ;

  constructor(private http: HttpClient){}

  registro(datos: any){
    return this.http.post(`${this.url}/auth/registro`, datos)
  }

  login(datos: any){
    return this.http.post(`${this.url}/auth/login`, datos)
  }

}
