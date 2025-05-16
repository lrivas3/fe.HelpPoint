import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CdkDropList, KanbanColumnComponent, TicketFormComponent]
})
export class KanbanComponent implements OnInit, OnDestroy {
    columns: KanbanColumn[] = [];
    private estadosSubscription?: Subscription;
    constructor(
        private readonly ticketService: TicketService,
        private readonly catalogo: CatalogoServiceService
    ) {
    }

    ngOnInit() {
        this.estadosSubscription = this.catalogo.getEstados().subscribe(estados => {
            if (estados && estados.length > 0) {
                this.initializeKanban(estados);
            }
        });
        // Forzar la carga inicial de estados
        this.catalogo.loadEstados();
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks
        if (this.estadosSubscription) {
            this.estadosSubscription.unsubscribe();
        }
    }

    private initializeKanban(estados: any[]) {
        this.columns = estados.map(estado => ({
            id: estado.value.toString(),
            title: estado.label,
            cards: []
        }));

        this.ticketService.listTickets().subscribe({
            next: (tickets) => {
                this.columns.forEach(col => col.cards = []);

                if (tickets && tickets.length > 0) {
                    tickets.forEach(ticket => {
                        if (ticket.estado && ticket.estado.id !== undefined && ticket.estado.id !== null) {
                            const column = this.columns.find(col => col.id === ticket.estado.id.toString());
                            if (column) {
                                const card = this.mapToKanbanCard(ticket);
                                column.cards.push(card);
                            } else {
                                console.warn(`No se encontró la columna para el estado ${ticket.estado.id}`);
                            }
                        } else {
                            console.warn(`Ticket ${ticket.id} no tiene un Estado válido o Estado.Id definido:`, ticket);
                        }
                    });
                } else {
                    console.warn('No se recibieron tickets del servidor');
                }
            },
            error: (error) => {
                console.error('Error al cargar tickets:', error);
            }
        });
    }

    private mapToKanbanCard(ticket: TicketResponse): KanbanCard {
        return {
            id: ticket.id,
            title: ticket.title,
            description: ticket.description ?? null,
            estado: {
                id: ticket.estado.id,
                nombre: ticket.estado.nombre
            },
            tipo: {
                id: ticket.tipo.id,
                nombre: ticket.tipo.nombre
            },
            prioridad: {
                id: ticket.prioridad.id,
                nombre: ticket.prioridad.nombre
            },
            creationDate: ticket.creationDate,
            closureDate: ticket.closureDate ?? null,
            orderInBoard: ticket.orderInBoard ?? 0,
            tags: ticket.tags,
            progress: ticket.progress,
            checkList: ticket.checkList,
            attachments: ticket.attachments,
            avatar: ticket.avatar,
            supportRequestId: ticket.supportRequestId,
            createdBy: ticket.createdBy,
            comments: ticket.comments
        };
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
        if (!ticket.estado?.id) {
            console.warn('Ticket creado sin Estado válido:', ticket);
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
        column.cards.sort((a, b) => (a.orderInBoard || 0) - (b.orderInBoard || 0));
    }
}
