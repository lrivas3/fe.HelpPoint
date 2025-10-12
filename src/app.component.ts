import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '@shared/toasts/toast/toast.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastComponent, ToastComponent],
    template: `<router-outlet></router-outlet>
        <app-toast></app-toast> `
})
export class AppComponent {}
