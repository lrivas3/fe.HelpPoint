import { Component } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { KanbanColumnComponent } from '@kanban/Components/kanban-column/kanban-column.component';
import { KanbanColumn } from '@models/kanban/kanban-list.model';
import { TicketFormComponent } from '@kanban/Components/ticket-form/ticket-form.component';
import { CatalogoServiceService } from '@kanban/services/catalogo.service.service';
import { TicketService } from '@kanban/services/ticket.service';
import { TicketResponse } from '@models/ticket/ticket-response.model';
import { KanbanCard } from '@models/kanban/kanban-card.model';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CdkDropList, KanbanColumnComponent, TicketFormComponent]
})
export class KanbanComponent {
    columns: KanbanColumn[] = [];

    constructor(
        private ticketService: TicketService,
        private catalogo: CatalogoServiceService
    ) {
    }

    ngOnInit() {
        // 1) Inicializa las columnas según los "estados" disponibles
        const estados = this.catalogo.getEstados();
        console.log('Estados disponibles:', estados);
        
        if (!estados || estados.length === 0) {
            console.warn('No hay estados disponibles');
            return;
        }

        this.columns = estados.map(e => ({
            id: e.code.toString(),
            title: e.name,
            cards: []
        }));
        console.log('Columnas inicializadas:', this.columns);

        // 2) Trae todos los tickets y los coloca en la columna correspondiente
        this.ticketService.listTickets().subscribe({
            next: (tickets: TicketResponse[]) => {
                console.log('Tickets recibidos:', tickets);
                tickets.forEach(t => {
                    if (!t.estado || !t.estado.id) {
                        console.warn('Ticket sin estado válido:', t);
                        return;
                    }
                    const col = this.columns.find(c => c.id === t.estado.id.toString());
                    if (col) {
                        col.cards.push(this.mapToKanbanCard(t));
                    } else {
                        console.warn(`No se encontró la columna para el estado ${t.estado.id}`);
                    }
                });
            },
            error: (error) => {
                console.error('Error al obtener tickets:', error);
            }
        });
    }

    // 3) Función de ayuda que convierte el DTO de backend en tu KanbanCard
    private mapToKanbanCard(t: TicketResponse): KanbanCard {
        console.log('Mapping ticket to KanbanCard:', t);
        const card = {
            id: t.id,
            title: t.titulo,
            description: t.descripcion,
            creationDate: new Date(t.fechaCreacion),
            closureDate: t.fechaCierre ? new Date(t.fechaCierre) : undefined,
            attachments: t.comments?.length || 0,
            avatars: [ t.createdBy.createdByUserName.charAt(0) ],
            orderInBoard: t.ordenEnTablero ?? 0,
            stateCode: t.estado.id,
            priorityCode: t.prioridad.id,
            tipoId: t.tipo.id
        };
        console.log('Mapped KanbanCard:', card);
        return card;
    }

    onDropColumn(event: CdkDragDrop<KanbanColumn[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

    addColumn() {
        this.columns.push({
            id: Math.random().toString(36).substring(2, 7),
            title: 'Nueva Lista',
            cards: []
        });
    }

    get dropListIds(): string[] {
        return this.columns.map((column) => column.id);
    }

    onTicketCreated(ticket: TicketResponse) {
        if (!ticket.estado || !ticket.estado.id) {
            console.warn('Ticket creado sin estado válido:', ticket);
            return;
        }

        const colId = ticket.estado.id.toString();
        const column = this.columns.find(c => c.id === colId);
        
        if (!column) {
            console.warn(`No se encontró la columna para el estado ${ticket.estado.id}`);
            return;
        }

        // Inserta el KanbanCard en la posición según su orden
        const card = this.mapToKanbanCard(ticket);
        column.cards.push(card);

        // Reordena la columna antes de renderizar
        column.cards.sort((a, b) => (a.orderInBoard! - b.orderInBoard!));
    }
}
