import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionService } from '../../services/publicacion-service';

@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

  misPublicaciones = signal<Publicacion[]>([]);

  usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  constructor(private publicacionService: PublicacionService,){}  

  cargarPublicaciones(){
      this.publicacionService.obtener('fecha', 0, 3).subscribe((respuesta: any) => {
        
        this.misPublicaciones.set(respuesta.publicaciones)
       
       
        console.log(this.misPublicaciones());
        
      },
     (err) => {
      console.log('ERROR DEL GET:', err);
    })
    }


}
