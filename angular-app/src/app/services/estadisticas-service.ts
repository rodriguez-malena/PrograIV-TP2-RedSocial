import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  private readonly url = 'https://angular-nest-eight.vercel.app';

  constructor(private http: HttpClient){}

  postPorUsuario(desde: string, hasta: string){
    return this.http.get<any[]>(`${this.url}/estadisticas/publicaciones?desde=${desde}&hasta=${hasta}`, { withCredentials: true})
  }

  comentariosPorTiempo(desde: string, hasta: string) {
    return this.http.get<any[]>(`${this.url}/estadisticas/comentarios?desde=${desde}&hasta=${hasta}`, { withCredentials: true})
  }

  comentariosPorPost(desde: string, hasta: string){
    return this.http.get<any[]>(`${this.url}/estadisticas/cometarios-publicaciones?desde=${desde}&hasta=${hasta}`, { withCredentials: true})
  }


}
