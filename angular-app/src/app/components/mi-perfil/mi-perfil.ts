import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionService } from '../../services/publicacion-service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-mi-perfil',
  imports: [DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  misPublicaciones = signal<Publicacion[]>([]);
  postSeleccionado : Publicacion | null = null;
  
  postAbierto = false;

  usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  constructor(private publicacionService: PublicacionService,){}  

  ngOnInit(): void {
    this.cargarMisPublicaciones()
  }
  
  cargarMisPublicaciones(){
      this.publicacionService.obtener('fecha', 0, 3).subscribe((respuesta: any) => {
        
        this.misPublicaciones.set(respuesta.publicaciones)
       
       
        console.log(this.misPublicaciones());
        
      },
     (err) => {
      console.log('ERROR DEL GET:', err);
    })
    }

  abrirPost(publicacion: Publicacion) {
  this.postSeleccionado = publicacion;
  this.postAbierto = true;
  }

  cerrarPost() {
    this.postAbierto = false;
    this.postSeleccionado = null;
  }

  eliminarPublicacion(publicacion: Publicacion){
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estas por borrar esta publicación',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d8c3a2',
        cancelButtonColor: '#5f4f39'
      }).then((result) => {
  
        if (result.isConfirmed) {
  
          this.publicacionService.eliminar(publicacion._id, this.usuario._id).subscribe(() => {
             
            this.misPublicaciones.update(lista => lista.filter(publi => publi._id !== publicacion._id)); // Actualizo y creo nuevo array filtrando las que no tienen el id de la eliminada 
  
              Swal.fire(
                'Eliminada',
                'La publicación fue eliminada del perfil',
                'success'
              );
            });
          this.cerrarPost()
        }
    })
    }


}
