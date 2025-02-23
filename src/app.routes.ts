import { Routes } from '@angular/router';
import { Notfound } from './app/modules/notfound/notfound';
import { LoginComponent } from '@auth/Pages/login/login.component';
import { Dashboard } from './app/modules/dashboard/dashboard';
import { AppLayout } from './app/layout/component/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/modules/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/modules/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/modules/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
