import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-carga',
  imports: [],
  templateUrl: './pagina-carga.html',
  styleUrl: './pagina-carga.css',
})
export class PaginaCarga implements OnInit {

  constructor(private auth: Auth, private router: Router ){}

  ngOnInit(): void {
    this.auth.autorizar().subscribe((usuario: any) => {

      sessionStorage.setItem('usuario', JSON.stringify(usuario))
    

      this.router.navigate(['/publicaciones'])
    },

    () => {
        this.router.navigate(['/login']);

    }
  )
  }
}
