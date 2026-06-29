import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private sessionService: SessionService){}


  usuario: any;

  ngOnInit() {
    this.usuario = JSON.parse(sessionStorage.getItem('usuario') || 'null');
  }

    
  logout() {
    this.sessionService.cerrarSesion()
    
  }
}
