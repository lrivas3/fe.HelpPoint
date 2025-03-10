import { Routes } from '@angular/router';
import { Notfound } from '@modules/notfound/notfound';
import { LoginComponent } from '@auth/Pages/login/login.component';
import { Dashboard } from '@modules/dashboard/dashboard';
import { AppLayout } from './app/layout/component/app.layout';
import { AuthGuard } from '@guards/auth.guard';
import { RedirectGuard } from '@guards/redirect.guard';
import { Access } from '@auth/access';
import { Error } from '@auth/error';
import { SupportRequestComponent } from '@support-request/support-request.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: Dashboard
            },
            {
                path: 'app',
                loadChildren: () => import('./app/modules/pages.routes')
            }
        ]
    },
    {
        path: 'login',
        canActivate: [RedirectGuard],
        component: LoginComponent
    },
    {
        path: 'support',
        component: SupportRequestComponent,
        children: [{ path: 'request', loadChildren: () => import('./app/public/public.routes') }]
    },
    { path: 'notfound', component: Notfound },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'auth', loadChildren: () => import('./app/modules/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
