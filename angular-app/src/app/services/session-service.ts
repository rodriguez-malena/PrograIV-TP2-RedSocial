import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private temporizador!: ReturnType<typeof setTimeout>;

  constructor(private auth: Auth, private router: Router) {}

  iniciarTemporizador() {

    clearTimeout(this.temporizador);

    this.temporizador = setTimeout(async () => {

        const respuesta = await Swal.fire({
          title: 'La sesión está por vencer',
          text: '¿Deseás extender la sesión?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, extender',
          cancelButtonText: 'Cerrar sesión'
        });

        if (respuesta.isConfirmed) {

          this.auth.refrescar().subscribe(() => {

            console.log('Token refrescado');

            // Reinicia otros  segundos
            this.iniciarTemporizador();

          }, () => {

            this.cerrarSesion();

          });

        } else {

          this.cerrarSesion();

        }

      }, 60000); // Avisa a los 10 segundos
    }

  cerrarSesion() {

    clearTimeout(this.temporizador);

    this.auth.logout().subscribe(() => {

      sessionStorage.removeItem('usuario');
      this.router.navigate(['/login']);

    }, () => {

      sessionStorage.removeItem('usuario');
      this.router.navigate(['/login']);

    });

  }
}