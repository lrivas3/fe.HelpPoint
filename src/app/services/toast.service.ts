import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastSeverity } from '@models/toast-severity';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    constructor(private messageService: MessageService) { }

    show(severity: ToastSeverity, summary: string, detail: string): void;
    show(severity: ToastSeverity, summary: string, detail: string, life: number): void;
    show(severity: ToastSeverity, summary: string, detail: string, sticky: boolean): void;
    show(severity: ToastSeverity, summary: string, detail: string, life: number, sticky: boolean): void;
    show(severity: ToastSeverity, summary: string, detail: string, lifeOrSticky?: number | boolean, sticky?: boolean): void {
        let lifeValue = 3000;
        let stickyValue = false;

        if (typeof lifeOrSticky === 'number') {
            lifeValue = lifeOrSticky;
        } else if (typeof lifeOrSticky === 'boolean') {
            stickyValue = lifeOrSticky;
        }

        if (typeof sticky === 'boolean') {
            stickyValue = sticky;
        }

        this.messageService.add({ severity, summary, detail, life: lifeValue, sticky: stickyValue });
    }

    options(severity: ToastSeverity, summary: string): any;
    options(severity: ToastSeverity, summary: string, life: number): any;
    options(severity: ToastSeverity, summary: string, sticky: boolean): any;
    options(severity: ToastSeverity, summary: string, life: number, sticky: boolean): any;
    options(severity: ToastSeverity, summary: string, lifeOrSticky?: number | boolean, sticky?: boolean): any {
        let lifeValue = 3000;
        let stickyValue = false;

        if (typeof lifeOrSticky === 'number') {
            lifeValue = lifeOrSticky;
        } else if (typeof lifeOrSticky === 'boolean') {
            stickyValue = lifeOrSticky;
        }

        if (typeof sticky === 'boolean') {
            stickyValue = sticky;
        }

        return { severity, summary, life: lifeValue, sticky: stickyValue };
    }

    clear() {
        this.messageService.clear();
    }
}
