import { Component, Input } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button, ButtonDirective } from 'primeng/button';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { Badge } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'app-kanban-card',
    imports: [Avatar, AvatarGroup, Button, CdkDrag, CdkDragHandle, NgForOf, NgIf, ProgressBar, Tag, Badge, Menu, DatePipe],
    templateUrl: './kanban-card.component.html',
    styleUrl: './kanban-card.component.scss'
})
export class KanbanCardComponent {
    @Input() ticketCard!: KanbanCard;
    items: MenuItem[] | undefined;

    removeTag(ticketCard: KanbanCard, success: string) {}
    ngOnInit() {
        console.log(this.ticketCard);
        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Eliminar',
                        icon: 'pi pi-trash',
                        command: () => this.deleteCard()
                    }
                ]
            }
        ];
    }

    private deleteCard() {}
}
