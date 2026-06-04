import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private URL = 'https://angular-nest-eight.vercel.app';

  constructor(private http: HttpClient){}

  registro(datos: any){
    return this.http.post(`${this.URL}/auth/registro`, datos)
  }

  login(datos: any){
    return this.http.post(`${this.URL}/auth/login`, datos)
  }

}
