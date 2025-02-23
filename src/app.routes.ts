import { Routes } from '@angular/router';
import { Notfound } from './app/modules/notfound/notfound';
import { LoginComponent } from './app/modules/auth/Pages/login/login.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/modules/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
