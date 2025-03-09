import { Component } from '@angular/core';
import { SupportFormComponent } from '@public/components/support-form/support-form.component';

@Component({
  selector: 'app-support-request',
    imports: [
        SupportFormComponent
    ],
    template: `
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen overflow-hidden">
            <div class="items-center justify-center w-full">
                <app-support-form></app-support-form>
            </div>
        </div>
    `
})
export class SupportRequestComponent {
}
