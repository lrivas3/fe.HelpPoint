import { Component, Input, OnInit } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { CdkDrag, CdkDragHandle, CdkDragPlaceholder, CdkDragStart } from '@angular/cdk/drag-drop';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Tag } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ToastService } from '@services/toast.service';
import { TicketService } from '@kanban/services/ticket.service';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-kanban-card',
    standalone: true,
    imports: [Avatar, AvatarGroup,
        Button, CdkDrag, CdkDragHandle,
        NgForOf, NgIf,
        Tag, Menu, DatePipe,
        CdkDragPlaceholder, NgStyle],
    templateUrl: './kanban-card.component.html',
    styleUrl: './kanban-card.component.scss',
    providers: [DialogService]
})
export class KanbanCardComponent implements OnInit {
    @Input() ticketCard!: KanbanCard;
    elementHeight: number = 0;
    items: MenuItem[] = [];

    constructor(private toastService: ToastService, private ticketService: TicketService, private dialogService: DialogService) {}

    ngOnInit() {
        console.log('KanbanCardComponent initialized with ticket:', this.ticketCard);
        console.log(this.ticketCard);
        this.items = [
            {
                label: 'Editar',
                icon: 'pi pi-pencil',
                command: () => this.openTicketForm()
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.deleteTicket()
            }
        ];
    }

    onDragStarted(event: CdkDragStart) {
        const element = event.source.element.nativeElement;
        this.elementHeight = element.offsetHeight;
    }

    openTicketForm() {
        const ref = this.dialogService.open(TicketFormComponent, {
            header: 'Editar Ticket',
            width: '70%',
            data: {
                ticket: this.ticketCard
            }
        });
    }

    deleteTicket() {
        // Implementar lógica de eliminación
    }

    removeTag(ticket: KanbanCard, tag: string) {
        // Implementar lógica de eliminación de etiquetas
    }
}
