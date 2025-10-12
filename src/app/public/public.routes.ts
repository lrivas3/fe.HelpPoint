import { Routes } from '@angular/router';
import { SupportFormComponent } from '@public/components/support-form/support-form.component';

export default [
    {
        path: '',
        component: SupportFormComponent
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
