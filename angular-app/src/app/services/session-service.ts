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
          cancelButtonText: 'Cerrar sesión',
          timer: 20000,
          timerProgressBar: true,
          allowOutsideClick: false,
          allowEscapeKey: false,

          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
          }
        });

        if (respuesta.isConfirmed) {

          this.auth.refrescar().subscribe({

            next: () => {

              console.log('Token refrescado');
  
              // Reinicia otros  segundos
              this.iniciarTemporizador();
            },

          error: async() => {

            await Swal.fire({
              icon: 'error',
              title: 'Sesión terminada',
              text: 'Tu sesión ya venció. Volvé a iniciar sesión.',
              allowOutsideClick: false,

              customClass: {
                popup: 'swal-popup',
                title: 'swal-titulo',
                htmlContainer: 'swal-texto',
                confirmButton: 'swal-confirm-btn'
              }

            });
            this.cerrarSesion();
          }

          });

        } else {
           Swal.fire({
              icon: 'info',
              title: 'Sesión terminada',
              text: 'Se ha cerrado la sesión',
              allowOutsideClick: false,
              timer: 20000,

              customClass: {
                popup: 'swal-popup',
                title: 'swal-titulo',
                htmlContainer: 'swal-texto',
                confirmButton: 'swal-confirm-btn'
              }

            });
          this.cerrarSesion();

        }

      }, 40000); // Avisa a los 40 segundos
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