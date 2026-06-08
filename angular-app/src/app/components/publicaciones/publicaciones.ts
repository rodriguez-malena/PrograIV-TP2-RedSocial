import { Component } from '@angular/core';

@Component({
  selector: 'app-publicaciones',
  imports: [],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
   usuario = JSON.parse(sessionStorage.getItem('usuario')!
);
}
