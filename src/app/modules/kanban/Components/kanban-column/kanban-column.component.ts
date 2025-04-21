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
            Id: t.Id,
            Titulo: t.Titulo,
            Descripcion: t.Descripcion ?? null,
            Estado: {
                Id: t.Estado.Id,
                Nombre: t.Estado.Nombre
            },
            Tipo: {
                Id: t.Tipo.Id,
                Nombre: t.Tipo.Nombre
            },
            Prioridad: {
                Id: t.Prioridad.Id,
                Nombre: t.Prioridad.Nombre
            },
            FechaCreacion: t.FechaCreacion,
            FechaCierre: t.FechaCierre ?? null,
            OrdenEnTablero: t.OrdenEnTablero ?? 0,
            SupportRequestId: t.SupportRequestId,
            CreatedBy: t.CreatedBy,
            Comments: t.Comments
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
            this.ticketService.updateTicket(card.Id, updateRequest).subscribe({
                next: () => console.log(`Orden actualizado para el ticket ${card.Id}`),
                error: (err) => console.error(`Error al actualizar el orden del ticket ${card.Id}:`, err)
            });
        });
    }

    addCard() {
        const newCard: KanbanCard = {
            Id: '', // lo genera el servidor
            Titulo: '',
            Descripcion: null,
            Estado: { Id: parseInt(this.column.id), Nombre: this.column.title },
            Tipo: { Id: 1, Nombre: '' },
            Prioridad: { Id: 2, Nombre: '' },
            FechaCreacion: null,
            FechaCierre: null,
            OrdenEnTablero: this.column.cards.length,
            SupportRequestId: undefined,
            CreatedBy: { CreatedByUserId: '', CreatedByUserName: '' },
            Comments: []
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
