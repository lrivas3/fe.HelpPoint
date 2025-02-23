import { Routes } from '@angular/router';
import { Menu } from './menu';

export default [
    { path: 'menu', data: { breadcrumb: 'Menu' }, component: Menu },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
