import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/bienvenida',
        pathMatch: 'full',
    },
    {
        path:'bienvenida',
        loadComponent: () => import('./components/bienvenida/bienvenida').then(m => m.Bienvenida)
    },
    {
        path:'login',
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path:'registro',
        loadComponent: () => import('./components/registro/registro').then(m => m.Registro)
    },
    {
        path:'mi-perfil',
        loadComponent: () => import('./components/mi-perfil/mi-perfil').then(m => m.MiPerfil),
        //canActivate:[authGuard]
    },
    {
        path:'publicaciones',
        loadComponent: () => import('./components/publicaciones/publicaciones').then(m => m.Publicaciones)
    },
    {
        path:'**',
        loadComponent: () => import('./components/error/error').then(m => m.Error)
    }
];
