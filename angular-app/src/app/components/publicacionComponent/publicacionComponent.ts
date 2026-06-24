import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe } from '@angular/common';
import { ComentarioService } from '../../services/comentario-service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


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
  
  @Output() eliminar = new EventEmitter<void>();
  
  comentarios = signal<any[]>([]);
  limit = 5;
  offset = 0;
  postAbierto = false;
  comentarioControl = new FormControl('');
  
  constructor(private comentarioService: ComentarioService){}


  inicializarComentarios() {
    this.offset = 0;
    this.cargarComentarios();
  }


  cargarComentarios(){
    console.log('Antes', this.comentarios().length);


    this.comentarioService.obtenerComentarios(this.publicacion._id, this.offset, this.limit).subscribe((respuesta: any) => {
      console.log('Respuesta', respuesta)
      this.comentarios.set([...respuesta])
      
      console.log('Después', this.comentarios.length);

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
    
      this.comentarios.update(actual => [respuesta, ...actual])
      this.comentarioControl.setValue('')
      this.inicializarComentarios();

      console.log(this.comentarios())
    })

  }
  

  editarComentario(id: string, nuevoComentario: string) {

  this.comentarioService.editarComentario(id, { mensaje: nuevoComentario}).subscribe(() => {

    const c = this.comentarios().find(c => c._id === id ? { ...c , mensaje: nuevoComentario, modificado: true}
      : c
    );
   

  });

}


  abrirPost() {
    console.log('Abriendo', this.publicacion._id);

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
