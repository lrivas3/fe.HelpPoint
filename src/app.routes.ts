import { Routes } from '@angular/router';
import { Notfound } from './app/modules/notfound/notfound';
import { LoginComponent } from '@auth/Pages/login/login.component';
import { Dashboard } from './app/modules/dashboard/dashboard';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectGuard } from '@guards/redirect.guard';

export const appRoutes: Routes = [
    {
        path: '',
        canActivate: [RedirectGuard],
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/modules/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/modules/pages.routes') }
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
