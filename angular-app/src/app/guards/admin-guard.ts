import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  
  const router = inject(Router);


  const usuarioStr = sessionStorage.getItem('usuario');

  if (!usuarioStr) {
    router.navigate(['/login']);
    return false;
  }

  const usuario = JSON.parse(usuarioStr);

  if (usuario?.perfil === 'admin') {
    return true;
  }

  router.navigate(['/publicaciones']);
  return false;


};
