import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe } from '@angular/common';
import { ComentarioService } from '../../services/comentario-service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comentario } from '../../interfaces/comentario';


@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, ReactiveFormsModule],
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

    this.comentarioService.crearComentario(datos).subscribe((respuesta: Comentario)=> {
    
      this.comentarios.update(actual => [respuesta, ...actual])
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

    const nuevoMensaje = this.comentarioEditado.value;

    if (!nuevoMensaje || !nuevoMensaje.trim()) return;

    this.comentarioService
      .editarComentario(comentarioId, { mensaje: nuevoMensaje })
      .subscribe((actualizado: any) => {

        this.comentarios.update(lista =>
          lista.map(c =>
            c._id === comentarioId
              ? { ...c, mensaje: actualizado.mensaje, modificado: true }
              : c
          )
        );

        this.cancelarEdicion();
      });
  }

/*-------------------
Acciones del modal Post
--------------------*/
  abrirPost() {
    console.log('Abriendo', this.publicacion._id);

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
  

/*Poder de eliminar post */
  puedeEliminar(publicacion: any): boolean {
    return (this.usuario?.perfil === 'admin' || this.usuario?._id === publicacion.usuario);
}
}
