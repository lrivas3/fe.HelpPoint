import { Component } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [Toast],
    template: `<p-toast position="top-right" [baseZIndex]="1200"></p-toast>`,
    styles: [`
        :host {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 1200;
        }
    `]
})
export class ToastComponent {
    constructor(private messageService: MessageService) {}
}
