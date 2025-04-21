import { Component, OnInit, effect } from '@angular/core';
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
import { PSelectableModel } from '@models/prime-components-options/p-selectable.model';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CdkDropList, KanbanColumnComponent, TicketFormComponent]
})
export class KanbanComponent implements OnInit {
    columns: KanbanColumn[] = [];

    constructor(
        private ticketService: TicketService,
        private catalogo: CatalogoServiceService
    ) {
        // Observar cambios en los estados
        effect(() => {
            const estados = this.catalogo.estados();
            console.log('Estados actualizados:', estados);
            if (estados && estados.length > 0) {
                this.initializeKanban();
            } else {
                console.warn('No hay estados disponibles, cargando...');
                this.catalogo.loadEstados();
            }
        });
    }

    ngOnInit() {
        // Forzar la carga inicial de estados
        this.catalogo.loadEstados();
    }

    private initializeKanban() {
        console.log('Estados disponibles:', this.catalogo.getEstados());
        this.columns = this.catalogo.getEstados().map(estado => ({
            id: estado.value.toString(),
            title: estado.label,
            cards: []
        }));
        console.log('Columnas inicializadas:', this.columns);

        this.ticketService.listTickets().subscribe({
            next: (tickets) => {
                console.log('Tickets recibidos:', tickets);
                // Limpiamos las columnas antes de asignar los nuevos tickets
                this.columns.forEach(col => col.cards = []);
                
                if (tickets && tickets.length > 0) {
                    tickets.forEach(ticket => {
                        // Check if ticket.Estado and ticket.Estado.Id exist
                        if (ticket.Estado && ticket.Estado.Id !== undefined && ticket.Estado.Id !== null) {
                            const column = this.columns.find(col => col.id === ticket.Estado.Id.toString());
                            if (column) {
                                const card = this.mapToKanbanCard(ticket);
                                column.cards.push(card);
                                console.log(`Ticket ${ticket.Id} agregado a la columna ${column.id}`);
                            } else {
                                console.warn(`No se encontró la columna para el estado ${ticket.Estado.Id}`);
                            }
                        } else {
                            // Log a warning if a ticket has no valid Estado
                            console.warn(`Ticket ${ticket.Id} no tiene un Estado válido o Estado.Id definido:`, ticket);
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
            Id: ticket.Id,
            Titulo: ticket.Titulo,
            Descripcion: ticket.Descripcion ?? null,
            Estado: {
                Id: ticket.Estado.Id,
                Nombre: ticket.Estado.Nombre
            },
            Tipo: {
                Id: ticket.Tipo.Id,
                Nombre: ticket.Tipo.Nombre
            },
            Prioridad: {
                Id: ticket.Prioridad.Id,
                Nombre: ticket.Prioridad.Nombre
            },
            FechaCreacion: ticket.FechaCreacion,
            FechaCierre: ticket.FechaCierre ?? null,
            OrdenEnTablero: ticket.OrdenEnTablero ?? 0,
            SupportRequestId: ticket.SupportRequestId,
            CreatedBy: ticket.CreatedBy,
            Comments: ticket.Comments
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
        if (!ticket.Estado?.Id) {
            console.warn('Ticket creado sin Estado válido:', ticket);
            return;
        }

        const colId = ticket.Estado.Id.toString();
        const column = this.columns.find(c => c.id === colId);
        
        if (!column) {
            console.warn(`No se encontró la columna para el estado ${ticket.Estado.Id}`);
            return;
        }

        // Inserta el KanbanCard en la posición según su orden
        const card = this.mapToKanbanCard(ticket);
        column.cards.push(card);

        // Reordena la columna antes de renderizar
        column.cards.sort((a, b) => (a.OrdenEnTablero || 0) - (b.OrdenEnTablero || 0));
    }
}
