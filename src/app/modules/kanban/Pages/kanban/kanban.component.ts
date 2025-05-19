import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { KanbanCardComponent } from '@kanban/Components/kanban-card/kanban-card.component';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CdkDropList,
        KanbanColumnComponent,
        TicketFormComponent,
    ]
})
export class KanbanComponent implements OnInit, OnDestroy {
    columns: KanbanColumn[] = [];

    private estadosSubscription?: Subscription;
    private ticketsChangedSubscription?: Subscription;

    // Guardamos el catálogo de estados para reusar
    private estadosList: { label: string; value: number }[] = [];

    constructor(
        private readonly ticketService: TicketService,
        private readonly catalogo: CatalogoServiceService
    ) {}

    ngOnInit() {
        // 1) Primero cargamos los estados para inicializar columnas
        this.estadosSubscription = this.catalogo.getEstados().subscribe(estados => {
            this.estadosList = estados;
            if (estados.length > 0) {
                this.initializeKanbanLists(estados);
            }
        });

        // Cargar catálogo en cache
        this.catalogo.loadEstados();
        this.catalogo.loadPrioridades();

        // 2) Nos suscribimos a cualquier cambio en tickets (create/update/comment)
        this.ticketsChangedSubscription = this.ticketService.ticketsChanged$.subscribe(() => {
            this.reloadCards();
        });
    }

    ngOnDestroy() {
        this.estadosSubscription?.unsubscribe();
        this.ticketsChangedSubscription?.unsubscribe();
        this.ticketService.clearSelectedTicket();
    }

    /** Crea las columnas y carga sus tarjetas */
    private initializeKanbanLists(estados: { label: string; value: number }[]) {
        // Mapear estados a KanbanColumn
        this.columns = estados.map(e => ({
            id: e.value.toString(),
            title: e.label,
            cards: []
        }));

        // Cargar tarjetas en esas columnas
        this.reloadCards();
    }

    /** Recarga solo las tarjetas, manteniendo las columnas */
    private reloadCards() {
        this.ticketService.listTicketsForKanban().subscribe({
            next: tickets => {
                // Vaciar tarjetas actuales
                this.columns.forEach(col => col.cards = []);

                // Reasignar cada ticket a su columna
                tickets.forEach(ticket => {
                    const col = this.columns.find(c => c.id === ticket.estado.id.toString());
                    if (col) {
                        col.cards.push(ticket);
                    } else {
                        console.warn(`Estado ${ticket.estado.id} sin columna asociada`);
                    }
                });
            },
            error: err => {
                console.error('Error al recargar tickets:', err);
            }
        });
    }

    /** Drag & drop de columnas (sin refresh adicional) */
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
        return this.columns.map(c => c.id);
    }

    /** Al crear/editar un ticket desde el form */
    onTicketSaved(ticket: TicketResponse) {
        // Podemos recargar todo o solo la columna afectada.
        // Aquí recargamos todo para garantizar consistencia:
        this.reloadCards();
    }
}
