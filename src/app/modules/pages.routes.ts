import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { KanbanComponent } from '@kanban/Pages/kanban/kanban.component';
import { AuthGuard } from '@guards/auth.guard';
import { RequestsListComponent } from '@modules/support/pages/requests-list/requests-list.component';

export default [
    {
        path: 'ticket',
        component: KanbanComponent,
        canActivate: [AuthGuard],
    },
    { path: 'requests', component: RequestsListComponent},
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
