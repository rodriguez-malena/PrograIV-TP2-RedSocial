import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgIf } from '@angular/common';
import { ComentarioService } from '../../services/comentario-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, NgIf, ReactiveFormsModule],
  templateUrl: './publicacionComponent.html',
  styleUrl: './publicacionComponent.css',
})
export class PublicacionComponent {
  
  @Input() publicacion! : Publicacion;

  @Input() usuarioId!: string;
  
  @Output() like = new EventEmitter<void>();
  
  @Output() eliminar = new EventEmitter<void>();
  
  comentarios: any[] = [];
  limit = 5;
  offset = 0;
  postAbierto = false;
  comentarioControl = new FormControl('');
  
  constructor(private comentarioService: ComentarioService){}


  inicializarComentarios() {
    this.comentarios = [];
    this.offset = 0;
    this.cargarComentarios();
  }


  cargarComentarios(){
    console.log('Antes', this.comentarios.length);


    this.comentarioService.obtenerComentarios(this.publicacion._id, this.offset, this.limit).subscribe((respuesta: any) => {
      console.log('Respuesta', respuesta)
      this.comentarios = [...this.comentarios, ...respuesta]
      
      console.log('Después', this.comentarios.length);
      console.log(this.comentarios.map(c => c._id));

      this.offset += this.limit
    })
  }

  cargarMas() {
    this.cargarComentarios();
  }

  comentarPublicacion(){

    const mensaje = this.comentarioControl.value

    if(!mensaje || !mensaje.trim()) return

    const datos = {
      mensaje,
      publicacionId : this.publicacion._id,
      usuarioId: this.usuarioId
    }

    this.comentarioService.crearComentario(datos).subscribe((respuesta: any)=> {
    
      this.comentarios = [respuesta, ...this.comentarios];
      this.comentarioControl.setValue('')
    })

  }
  

  editarComentario(id: string, nuevoComentario: string) {

  this.comentarioService.editarComentario(id, { mensaje: nuevoComentario}).subscribe(() => {

    const c = this.comentarios.find(c => c._id === id);
    c.mensaje = nuevoComentario;
    c.modificado = true;

  });

}


abrirPost() {
    console.log('Abrir', this.publicacion._id);

    this.postAbierto = true;
    this.inicializarComentarios();
  }
  
  cerrarModal() {
    this.postAbierto = false;
  }

    
  yaDioLike(){
    return this.publicacion.likes.includes(this.usuarioId)
    }
  }
