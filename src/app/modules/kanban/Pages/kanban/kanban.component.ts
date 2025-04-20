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
                
                tickets.forEach(ticket => {
                    const column = this.columns.find(col => col.id === ticket.stateCode.toString());
                    if (column) {
                        column.cards.push(this.mapToKanbanCard(ticket));
                    } else {
                        console.warn(`No se encontró la columna para el stateCode ${ticket.stateCode}`);
                    }
                });
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
            description: ticket.description ?? undefined,
            stateCode: ticket.stateCode,
            tipoId: ticket.tipoId ?? undefined,
            priorityCode: ticket.priorityCode ?? undefined,
            creationDate: ticket.creationDate ? new Date(ticket.creationDate) : undefined,
            closureDate: ticket.closureDate ? new Date(ticket.closureDate) : undefined,
            tags: ticket.tags ?? [],
            orderInBoard: ticket.orderInBoard ?? 0,
            progress: ticket.progress ?? undefined,
            checklist: ticket.checklist ?? undefined,
            attachments: ticket.attachments ?? 0,
            avatars: ticket.avatars ?? []
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
        if (!ticket.stateCode) {
            console.warn('Ticket creado sin stateCode válido:', ticket);
            return;
        }

        const colId = ticket.stateCode.toString();
        const column = this.columns.find(c => c.id === colId);
        
        if (!column) {
            console.warn(`No se encontró la columna para el stateCode ${ticket.stateCode}`);
            return;
        }

        // Inserta el KanbanCard en la posición según su orden
        const card = this.mapToKanbanCard(ticket);
        column.cards.push(card);

        // Reordena la columna antes de renderizar
        column.cards.sort((a, b) => (a.orderInBoard || 0) - (b.orderInBoard || 0));
    }
}
