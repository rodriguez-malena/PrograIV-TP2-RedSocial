import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Red social');

  constructor(public router: Router) {}

ocultarNavbar(): boolean {
  return this.router.url === '/login' ||
         this.router.url === '/registro' || this.router.url === '/bienvenida';
}
}