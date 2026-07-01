import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgIf } from '@angular/common';
import { ComentarioService } from '../../services/comentario-service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comentario } from '../../interfaces/comentario';
import Swal from 'sweetalert2';
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido-pipe';
import { EstadoPublicacion } from '../../directivas/estado-publicacion';
import { BotonEliminarAdmin } from '../../directivas/boton-eliminar-admin';
import { ImagenBrillante } from '../../directivas/imagen-brillante';
import { ContadorCaracteresPipe } from '../../pipes/contador-caracteres-pipe';


@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, ReactiveFormsModule, TiempoTranscurridoPipe, EstadoPublicacion, BotonEliminarAdmin, ImagenBrillante, ContadorCaracteresPipe],
  templateUrl: './publicacionComponent.html',
  styleUrl: './publicacionComponent.css',
})


export class PublicacionComponent {
  
  @Input() publicacion! : Publicacion;

  @Input() usuarioId!: string;
  
  @Output() like = new EventEmitter<void>();
  
  @Output() eliminar = new EventEmitter<Publicacion>();
  
  comentarios = signal<Comentario[]>([]);
  limit = 5;
  offset = 0;
  postAbierto = false;
  comentarioControl = new FormControl('', [Validators.maxLength(30)]);

  comentarioEditandoId: string | null = null;
  comentarioEditado = new FormControl('', [Validators.maxLength(30)]);
  totalComentarios = signal(0);

  usuario = JSON.parse(sessionStorage.getItem('usuario')!)


  constructor(private comentarioService: ComentarioService){}

/*--------------------------------
  Vista de comentarios 
----------------------------------*/

  inicializarComentarios() {
    this.offset = 0;
    this.comentarios.set([])
    this.totalComentarios.set(0)

    this.cargarComentarios();
  }

  cargarComentarios(){

    console.log('Offset', this.offset)
    this.comentarioService.obtenerComentarios(this.publicacion._id, this.offset, this.limit).subscribe((respuesta) => {
      
     
      console.log('Respuesta', respuesta)

      this.comentarios.update(actual=> [...actual, ...respuesta.comentarios])
      
      this.totalComentarios.set(respuesta.total);

      this.offset += this.limit;
      
     
    })
  }


  hayMasComentarios() {
    return this.comentarios().length < this.totalComentarios();
  }
  
  cargarMas() {
    this.cargarComentarios();
  }

/*----------------
  Nuevo comentario
----------------*/

  comentarPublicacion(){
    const mensaje = this.comentarioControl.value

    if(!mensaje || !mensaje.trim()) return;
    if (mensaje.length > 30) return;

    const datos = {
      mensaje,
      publicacionId : this.publicacion._id,
      usuarioId: this.usuarioId
    }

    this.comentarioService.crearComentario(datos).subscribe(() => {
    
      this.comentarioControl.setValue('')
      this.inicializarComentarios();

      console.log(this.comentarios())
    })

  }
  
/*-------------------
  Editar comentario
--------------------*/

  iniciarEdicion(comentario: any) {
    this.comentarioEditandoId = comentario._id;
    this.comentarioEditado.setValue(comentario.mensaje);
  }

  cancelarEdicion() {
    this.comentarioEditandoId = null;
    this.comentarioEditado.reset();
  }


  guardarEdicion(comentarioId: string) {

    if (this.comentarioEditado.invalid) {
      this.comentarioEditado.markAsTouched();
      return;
    }

    const nuevoMensaje = this.comentarioEditado.value;

    if (!nuevoMensaje || !nuevoMensaje.trim()) return;

    this.comentarioService.editarComentario(comentarioId, { mensaje: nuevoMensaje }).subscribe((actualizado: any) => {

        this.comentarios.update(lista => lista.map(c =>
          c._id === comentarioId ? { ...c, mensaje: actualizado.mensaje, modificado: true } : c));
        });
        
        this.cancelarEdicion();

        Swal.fire({
          icon: 'success',
          title: 'Comentario editado',
          text: 'El comentario se actualizó correctamente.',
          timer: 1500,
          showConfirmButton: false,

          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
          }
      });

    
  }

/*-------------------
Acciones del modal Post
--------------------*/
  abrirPost() {
    if (this.publicacion.eliminada) {
      Swal.fire({
        icon: 'warning',
        title: 'Publicación eliminada',
        text: 'No podés ver una publicación eliminada'
      });
      return;
    }
    this.postAbierto = true;
    this.inicializarComentarios();
  }
  
  cerrarModal() {
    this.postAbierto = false;
  }

/*-------
Like
--------*/
  yaDioLike(){
    return this.publicacion.likes.includes(this.usuarioId)
    }
  


get esAdmin(): boolean {
  const resultado = this.usuario?.perfil === 'admin';
  console.log('usuario:', this.usuario, 'esAdmin:', resultado);
  return resultado;

}
}