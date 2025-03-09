import { Component, Input, OnInit } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragStart } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { Badge } from 'primeng/badge';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastService } from '@services/toast.service';
import { ToastSeverity } from '@models/toast-severity';

@Component({
    selector: 'app-kanban-card',
    standalone: true,
    imports: [Avatar, AvatarGroup, Button, CdkDrag, CdkDragHandle, NgForOf, NgIf, ProgressBar, Tag, Badge, Menu, DatePipe, CdkDragPlaceholder, NgStyle],
    templateUrl: './kanban-card.component.html',
    styleUrl: './kanban-card.component.scss'
})
export class KanbanCardComponent implements OnInit {
    constructor(private toastService: ToastService) {}
    @Input() ticketCard!: KanbanCard;
    items: MenuItem[] | undefined;
    elementHeight: number = 50;

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


    onDragStarted(event: CdkDragStart): void {
        const draggedElement = event.source.element.nativeElement;
        this.elementHeight = draggedElement.getBoundingClientRect().height;
    }

    private deleteCard() {}
}
