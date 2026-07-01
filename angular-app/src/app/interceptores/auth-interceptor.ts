import { HttpInterceptorFn,  HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

let mostrandoSesion = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401 && !mostrandoSesion) {

        mostrandoSesion = true;

        sessionStorage.removeItem('usuario');

        Swal.fire({
          icon: 'warning',
          title: 'Sesión vencida',
          text: 'Tu sesión expiró. Volvé a iniciar sesión.',
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            popup: 'swal-popup',
            title: 'swal-titulo',
            htmlContainer: 'swal-texto',
            confirmButton: 'swal-confirm-btn'
          }
        }).then(() => {

          mostrandoSesion = false;
          router.navigate(['/login']);

        });

      }

      return throwError(() => error);

    })

  );

};