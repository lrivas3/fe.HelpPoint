import { Component, ViewChild } from '@angular/core';
import { Menu } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { NgIf } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { SvgIconComponent } from '@shared/Icon/svg-icon/svg-icon.component';

@Component({
    selector: 'app-app-top-menu',
    imports: [Menu, Ripple, Badge, NgIf, Avatar, SvgIconComponent],
    template: `
        <p-menu #menu [model]="items" [popup]="true" [appendTo]="'body'" class="flex justify-center" styleClass="w-full md:w-60">
            <ng-template #start>
                <span class="inline-flex items-center gap-1 px-2 py-2">
                    <app-svg-icon [width]="'1.5rem'" [height]="'1.5rem'"></app-svg-icon>
                    <span class="text-xl font-semibold"> help<span class="text-primary">point</span> </span>
                </span>
            </ng-template>
            <ng-template #submenuheader let-item>
                <span class="text-primary font-bold">{{ item.label }}</span>
            </ng-template>
            <ng-template #item let-item>
                <a pRipple class="flex items-center p-menu-item-link">
                    <span [class]="item.icon"></span>
                    <span class="ml-2">{{ item.label }}</span>
                    <p-badge *ngIf="item.badge" class="ml-auto" [value]="item.badge" />
                    <span *ngIf="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">
                        {{ item.shortcut }}
                    </span>
                </a>
            </ng-template>
            <ng-template #end>
                <button pRipple class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                    <p-avatar image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" class="mr-2" shape="circle" />
                    <span class="inline-flex flex-col">
                        <span class="font-bold">Amy Elsner</span>
                        <span class="text-sm">Admin</span>
                    </span>
                </button>
            </ng-template>
        </p-menu>
    `
})
export class AppTopMenuComponent {
    @ViewChild('menu') menu!: Menu;
    items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            { separator: true },
            {
                label: 'Tickets',
                items: [
                    { label: 'New', icon: 'pi pi-plus', shortcut: '⌘+N' },
                    { label: 'Search', icon: 'pi pi-search', shortcut: '⌘+S' }
                ]
            },
            {
                label: 'Perfil',
                items: [
                    { label: 'Configuraciones', icon: 'pi pi-cog', shortcut: '⌘+O' },
                    { label: 'Notificaciones', icon: 'pi pi-inbox', badge: '2' },
                    { label: 'Cerrar Sesión', icon: 'pi pi-sign-out', shortcut: '⌘+Q' }
                ]
            },
            { separator: true }
        ];
    }

    open(event: Event) {
        this.menu.toggle(event);
    }
}
