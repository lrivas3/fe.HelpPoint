import { Routes } from '@angular/router';
import { Notfound } from './app/modules/notfound/notfound';
import { LoginComponent } from '@auth/Pages/login/login.component';
import { Dashboard } from './app/modules/dashboard/dashboard';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectGuard } from '@guards/redirect.guard';
import pagesRoutes from './app/modules/pages.routes';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'app', loadChildren: () => import('./app/modules/pages.routes') }
        ]
    },
    {
        path: 'login',
        canActivate: [RedirectGuard],
        component: LoginComponent
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/modules/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
