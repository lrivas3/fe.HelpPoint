import { Component, Input } from '@angular/core';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NgClass, NgIf } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-btn',
    standalone: true,
    imports: [ProgressSpinner, NgIf, NgClass, Button],
    templateUrl: './button.component.html'
})
export class ButtonComponent {
    @Input() disabled = false;
    @Input() loading = false;
    @Input() typeBtn: 'reset' | 'submit' | 'button' = 'button';
    @Input() color: 'success' | 'primary' | 'danger' | 'light' | 'sky' = 'primary';

    mapColors = {
        success: {
            'bg-success-700': true,
            'hover:bg-success-800': true,
            'focus:ring-success-300': true,
            'text-white': true
        },
        primary: {
            'bg-primary-700': true,
            'hover:bg-primary-800': true,
            'focus:ring-primary-300': true,
            'text-white': true
        },
        danger: {
            'bg-danger-700': true,
            'hover:bg-danger-800': true,
            'focus:ring-danger-300': true,
            'text-white': true
        },
        light: {
            'bg-gray-200': true,
            'hover:bg-gray-500': true,
            'focus:ring-gray-50': true,
            'text-gray-700': true
        },
        sky: {
            'bg-sky-700': true,
            'hover:bg-sky-800': true,
            'focus:ring-sky-300': true,
            'text-white': true
        }
    };

    constructor() {}

    get colors() {
        return this.mapColors[this.color] || {};
    }
}
