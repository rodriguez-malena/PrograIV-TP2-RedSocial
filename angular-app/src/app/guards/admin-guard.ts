import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  
  const router = inject(Router);

  const usuario = JSON.parse(sessionStorage.getItem('usuario')!);

  if (usuario?.perfil === 'admin') {
    return true;
  }

  router.navigate(['/publicaciones']);
  return false;


};
