import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';

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
        path: 'pagina-carga',
        loadComponent: () => import('./components/pagina-carga/pagina-carga'). then(m => m.PaginaCarga)
            
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
        path:'dashnnoard-usuarios',
        loadComponent: () => import('./components/dashboard-usuarios/dashboard-usuarios').then(m => m.DashboardUsuarios),
        canActivate: [adminGuard]
    },
    {
        path:'**',
        loadComponent: () => import('./components/error/error').then(m => m.Error)
    }
];
