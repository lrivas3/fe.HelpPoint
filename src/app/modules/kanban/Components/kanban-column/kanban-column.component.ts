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
        console.log('Setting column:', value);
        this._column = value;
    }
    get column(): KanbanColumn {
        return this._column;
    }
    @Input() dropListIds: string[] = [];

    items: MenuItem[] | undefined;

    constructor(private ticketService: TicketService) {
    }

    ngOnInit(){
        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Refrescar',
                        icon: 'pi pi-refresh',
                        command: () => this.refreshColumn()
                    },
                    {
                        label: 'Eliminar',
                        icon: 'pi pi-trash',
                        command: () => this.deleteColumn()
                    }
                ]
            }
        ];
    }

    private refreshColumn() {
        this.ticketService.listTickets().subscribe(tickets => {
            // Limpia la columna
            this.column.cards = [];
            // Vuelve a filtrar para este estado
            tickets
                .filter(t => t.estado.id.toString() === this.column.id)
                .forEach(t => this.column.cards.push(this.mapToKanbanCard(t)));
        });
    }

    // 3) Función de ayuda que convierte el DTO de backend en tu KanbanCard
    private mapToKanbanCard(t: TicketResponse): KanbanCard {
        return {
            id: t.id,
            title: t.titulo,
            description: t.descripcion,
            creationDate: new Date(t.fechaCreacion),
            closureDate: t.fechaCierre ? new Date(t.fechaCierre) : undefined,
            attachments: t.comments?.length || 0,
            avatars: [ t.createdBy.createdByUserName.charAt(0) ],
            orderInBoard: t.ordenEnTablero ?? 0,
            stateCode: t.estado.id,
            priorityCode: t.prioridad.id
        };
    }

    onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(this.column.cards, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                this.column.cards,
                event.previousIndex,
                event.currentIndex
            );
        }

        // 1) Reasigna orderInBoard según nueva posición
        this.column.cards.forEach((card, idx) => card.orderInBoard = idx);

        // 2) Envía actualización de orden para cada tarjeta
        this.column.cards.forEach(card => {
            this.ticketService.updateTicket(card.id, { ordenEnTablero: card.orderInBoard! })
                .subscribe({
                    next: () => {/* opcional: toast de éxito */},
                    error: e => console.error('No se pudo actualizar orden', e)
                });
        });
    }

    addCard() {
        const newCard: KanbanCard = {
            id: '', // lo genera el servidor
            title: '',
            description: null,
            stateCode: +this.column.id, // importante para enviar estado
            orderInBoard: this.column.cards.length,
            // … demás propiedades…
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
