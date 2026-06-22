import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-publicacion',
  imports: [DatePipe],
  templateUrl: './publicacionComponent.html',
  styleUrl: './publicacionComponent.css',
})
export class PublicacionComponent {

  @Input() publicacion! : Publicacion;

  @Input() usuarioId!: string;

  @Output() like = new EventEmitter<void>();

  @Output() eliminar = new EventEmitter<void>();


    yaDioLike(){
      return this.publicacion.likes.includes(this.usuarioId)
  
    }

}
