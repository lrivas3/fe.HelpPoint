import { Component, Input, OnInit } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragStart } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgIf, NgStyle, SlicePipe } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';
import { Tag } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastService } from '@services/toast.service';
import { TicketService } from '@kanban/services/ticket.service';

@Component({
    selector: 'app-kanban-card',
    standalone: true,
    imports: [Avatar, AvatarGroup,
        Button, CdkDrag, CdkDragHandle,
        NgForOf, NgIf, ProgressBar,
        Tag, Menu, DatePipe,
        CdkDragPlaceholder, NgStyle,
        SlicePipe ],
    templateUrl: './kanban-card.component.html',
    styleUrl: './kanban-card.component.scss'
})
export class KanbanCardComponent implements OnInit {
    constructor(private toastService: ToastService, private ticketService: TicketService) {}
    @Input() ticketCard!: KanbanCard;
    items: MenuItem[] | undefined;
    elementHeight: number = 50;
    openTicketForm(): void {
        this.ticketService.setSelectedTicket(this.ticketCard);
    }

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
