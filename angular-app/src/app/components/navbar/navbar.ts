import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private router: Router, 
              private auth: Auth){}

  
  logout() {
    this.auth.logout().subscribe(() => {
      sessionStorage.removeItem('usuario');
      this.router.navigate(['/bienvenida']);
    })
  }
}
