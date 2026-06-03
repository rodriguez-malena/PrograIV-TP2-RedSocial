import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class Auth {

  private URL = 'http://localhost:3000/auth';

  constructor(private http: HttpClient){}

  registro(datos: any){
    return this.http.post(`${this.URL}/registro`, datos)
  }

  login(datos: any){
    return this.http.post(`${this.URL}/login`, datos)
  }

}
