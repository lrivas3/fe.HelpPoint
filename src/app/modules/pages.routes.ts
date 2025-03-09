import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { KanbanComponent } from '@kanban/Pages/kanban/kanban.component';
import { AuthGuard } from '@guards/auth.guard';

export default [
    {
        path: 'ticket',
        component: KanbanComponent,
        canActivate: [AuthGuard],
    },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
