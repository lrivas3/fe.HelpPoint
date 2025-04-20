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

    constructor(private readonly ticketService: TicketService) {
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

    // 3) Función de ayuda que convierte el DTO de backend en tu KanbanCard
    private mapToKanbanCard(t: TicketResponse): KanbanCard {
        return {
            id: t.id,
            title: t.title,
            description: t.description ?? null,
            stateCode: t.stateCode,
            tipoId: t.tipoId ?? undefined,
            priorityCode: t.priorityCode ?? undefined,
            creationDate: t.creationDate ? new Date(t.creationDate) : null,
            closureDate: t.closureDate ? new Date(t.closureDate) : undefined,
            orderInBoard: t.orderInBoard,
            tags: t.tags ?? [],
            progress: t.progress ?? undefined,
            checklist: t.checklist ?? undefined,
            attachments: t.attachments ?? 0,
            avatars: t.avatars ?? []
        };
    }

    onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }

        // Actualizar el orden en el backend
        event.container.data.forEach((card, index) => {
            this.ticketService.updateTicket(card.id, { orderInBoard: index }).subscribe({
                next: () => console.log(`Orden actualizado para el ticket ${card.id}`),
                error: (err) => console.error(`Error al actualizar el orden del ticket ${card.id}:`, err)
            });
        });
    }

    addCard() {
        const newCard: KanbanCard = {
            id: '', // lo genera el servidor
            title: '',
            description: null,
            stateCode: +this.column.id, // Usamos el ID de la columna actual como stateCode
            orderInBoard: this.column.cards.length,
            tags: [],
            avatars: []
        };
        this.ticketService.setSelectedTicket(newCard);
    }

    private deleteColumn() {

    }

    confirmEdit() {

    }

    get connectedDropListIds(): string[] {
        return this.dropListIds.filter(id => id !== this.column.id);
    }
}
