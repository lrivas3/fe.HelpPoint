import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { Menu } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';
import { Badge } from 'primeng/badge';
import { NgIf } from '@angular/common';
import { Avatar } from 'primeng/avatar';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SvgIconComponent } from '@shared/Icon/svg-icon/svg-icon.component';
import { TokenService } from '@services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

@Component({
    selector: 'app-app-top-menu',
    imports: [Menu, Ripple, Badge, NgIf, Avatar, SvgIconComponent],
    template: `
        <p-menu #menu [model]="items" [popup]="true" [appendTo]="'body'" class="flex justify-center"
                styleClass="w-full md:w-60">
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
                    <span *ngIf="item.shortcut"
                          class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">
                        {{ item.shortcut }}
                    </span>
                </a>
            </ng-template>
            <ng-template #end>
                <button pRipple
                        class="relative overflow-hidden w-full border-0 bg-transparent flex items-start p-2 pl-4 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-none cursor-pointer transition-colors duration-200">
                    <p-avatar label="{{user?.avatar }}" styleClass="mr-2"
                              [style]="{ 'background-color': '#dee9fc', 'color': '#1a2551' }" class="w-3 h-3" shape="circle" />
                    <span class="inline-flex flex-col">
                        <span class="font-bold">{{ user?.name }}</span>
                        <span class="text-sm">{{ user?.role }}</span>
                    </span>
                </button>
            </ng-template>
        </p-menu>
    `
})
export class AppTopMenuComponent implements OnInit {
    constructor(private tokenService: TokenService,
                private router: Router,
                private authService: AuthService) {}

    @ViewChild('menu') menu!: Menu;
    items: MenuItem[] | undefined;
    user: User | null = null;

    ngOnInit() {

        this.authService.user$.subscribe(user => {
            this.user = user;
        })

        this.items = [
            { separator: true },
            {
                label: 'Tickets',
                items: [
                    { label: 'Nuevo', icon: 'pi pi-plus', shortcut: 'CTRL+N' },
                    { label: 'Buscar', icon: 'pi pi-search', shortcut: 'CTRL+K' }
                ]
            },
            {
                label: 'Perfil',
                items: [
                    { label: 'Configuraciones', icon: 'pi pi-cog', shortcut: 'CTRL+O' },
                    { label: 'Notificaciones', icon: 'pi pi-inbox', badge: '2' },
                    {
                        label: 'Cerrar Sesión',
                        icon: 'pi pi-sign-out',
                        shortcut: 'CTRL+Q',
                        command: () => this.logOut()
                    }
                ]
            },
            { separator: true }
        ];
    }

    open(event: Event) {
        this.menu.toggle(event);
    }

    logOut(): void {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
        this.router.navigate(['/login']);
    }

    // Listen for keydown events at the document level
    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (!this.items) {
            return;
        }
        if (this.handleShortcutForItems(this.items, event)) {
            event.preventDefault();
        }
    }

    // Recursively checks items for a matching shortcut
    private handleShortcutForItems(items: MenuItem[], event: KeyboardEvent): boolean {
        for (const item of items) {
            if (item['shortcut'] && this.matchesShortcut(event, item['shortcut'])) {
                if (item.command) {
                    const commandEvent: MenuItemCommandEvent = { originalEvent: event, item };
                    item.command(commandEvent);
                    return true;
                }
            }
            if (item.items) {
                if (this.handleShortcutForItems(item.items, event)) {
                    return true;
                }
            }
        }
        return false;
    }

    private matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
        const keys = shortcut.toLowerCase().split('+').map(k => k.trim());
        const ctrlRequired = keys.includes('ctrl') || keys.includes('control');
        const shiftRequired = keys.includes('shift');
        const altRequired = keys.includes('alt');
        const keyRequired = keys.find(k => k !== 'ctrl' && k !== 'control' && k !== 'shift' && k !== 'alt');
        if (ctrlRequired && !event.ctrlKey) return false;
        if (shiftRequired && !event.shiftKey) return false;
        if (altRequired && !event.altKey) return false;
        return !(keyRequired && event.key.toLowerCase() !== keyRequired);

    }
}
