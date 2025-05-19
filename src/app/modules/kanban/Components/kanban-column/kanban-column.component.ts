import { Component, Input } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { KanbanCardComponent } from '@kanban/Components/kanban-card/kanban-card.component';
import { KanbanColumn } from '@models/kanban/kanban-list.model';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TicketService } from '@kanban/services/ticket.service';
import { TicketResponse } from '@models/ticket/ticket-response.model';
import { ReorderPayload, ReorderTicket } from '@models/ticket/move-ticket-request';
import { ToastService } from '@services/toast.service';
import { ToastSeverity } from '@models/toast-severity';

@Component({
    selector: 'app-kanban-column',
    templateUrl: './kanban-column.component.html',
    styleUrls: ['./kanban-column.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InplaceModule, CdkDropList, KanbanCardComponent, InputText, Menu]
})
export class KanbanColumnComponent {
    private _column!: KanbanColumn;

    @Input() set column(value: KanbanColumn) {
        this._column = value;
    }
    get column(): KanbanColumn {
        return this._column;
    }
    @Input() dropListIds: string[] = [];

    items: MenuItem[] | undefined;

    constructor(
        private readonly ticketService: TicketService,
        private readonly toastService: ToastService
    ) {
        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Eliminar',
                        icon: 'pi pi-trash',
                        command: () => this.deleteColumn()
                    }
                ]
            }
        ];
    }

    private mapToKanbanCard(t: TicketResponse): KanbanCard {
        return {
            id: t.id,
            title: t.title,
            description: t.description ?? null,
            estado: {
                id: t.estado.id,
                nombre: t.estado.nombre
            },
            tipo: {
                id: t.tipo.id,
                nombre: t.tipo.nombre
            },
            prioridad: {
                id: t.prioridad.id,
                nombre: t.prioridad.nombre
            },
            creationDate: t.creationDate,
            closureDate: t.closureDate ?? null,
            orderInBoard: t.orderInBoard ?? 0,
            tags: t.tags,
            progress: t.progress,
            checkList: t.checkList,
            attachments: t.attachments,
            avatar: t.avatar,
            supportRequestId: t.supportRequestId,
            createdBy: t.createdBy,
            comments: t.comments
        };
    }

    onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
        // 1) Update the in-memory array so the UI moves the card
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }

        const newEstadoId   = Number(this.column.id);
        const newEstadoName = this.column.title;
        event.container.data.forEach(card => {
            card.estado = { id: newEstadoId, nombre: newEstadoName };
            card.orderInBoard = event.container.data.indexOf(card);
        });

        // 2) Build the batch payload
        const tickets: ReorderTicket[] = event.container.data.map((card, index) => ({
            TicketId: card.id,
            EstadoId: newEstadoId,
            OrdenEnTablero: index
        }));
        const payload: ReorderPayload = { tickets };

        // 3) Send one HTTP call for all moved cards
        this.ticketService.moveTicket(payload).subscribe({
            next: () => this.toastService.show(ToastSeverity.Success, 'Éxito', 'Orden de tickets actualizado correctamente'),
            error: (err) => {
                this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudo reordenar los tickets');
                console.error('Error al reordenar tickets:', err);
            }
        });
    }

    addCard() {
        const newCard: KanbanCard = {
            id: '', // lo genera el servidor
            title: '',
            description: null,
            estado: { id: parseInt(this.column.id), nombre: this.column.title },
            tipo: { id: 1, nombre: '' },
            prioridad: { id: 2, nombre: '' },
            creationDate: null,
            closureDate: null,
            orderInBoard: this.column.cards.length,
            tags: [],
            progress: null,
            checkList: null,
            attachments: [],
            avatar: null,
            supportRequestId: undefined,
            createdBy: { createdByUserId: '', createdByUserName: '' },
            comments: []
        };
        this.ticketService.setSelectedTicket(newCard);
    }

    private deleteColumn() {
        // Implementar lógica de eliminación de columna
    }

    confirmEdit() {
        // Implementar lógica de confirmación de edición
    }

    get connectedDropListIds(): string[] {
        return this.dropListIds.filter((id) => id !== this.column.id);
    }
}
