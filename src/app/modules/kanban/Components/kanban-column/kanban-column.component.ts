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
import { PartialTicketRequest } from '@models/ticket/ticket-request.model';

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

    private mapToKanbanCard(t: TicketResponse): KanbanCard {
        return {
            id: t.id,
            titulo: t.titulo,
            descripcion: t.descripcion ?? null,
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
            fechaCreacion: t.fechaCreacion,
            fechaCierre: t.fechaCierre ?? null,
            ordenEnTablero: t.ordenEnTablero ?? 0,
            supportRequestId: t.supportRequestId,
            createdBy: t.createdBy,
            comments: t.comments
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
            const updateRequest: PartialTicketRequest = {
                OrdenEnTablero: index,
                EstadoId: parseInt(event.container.id)
            };
            this.ticketService.updateTicket(card.id, updateRequest).subscribe({
                next: () => console.log(`Orden actualizado para el ticket ${card.id}`),
                error: (err) => console.error(`Error al actualizar el orden del ticket ${card.id}:`, err)
            });
        });
    }

    addCard() {
        const newCard: KanbanCard = {
            id: '', // lo genera el servidor
            titulo: '',
            descripcion: null,
            estado: { id: parseInt(this.column.id), nombre: this.column.title },
            tipo: { id: 1, nombre: '' },
            prioridad: { id: 2, nombre: '' },
            fechaCreacion: null,
            fechaCierre: null,
            ordenEnTablero: this.column.cards.length,
            supportRequestId: undefined,
            createdBy: { CreatedByUserId: '', CreatedByUserName: '' },
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
        return this.dropListIds.filter(id => id !== this.column.id);
    }
}
