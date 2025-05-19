import { Component, OnDestroy, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TicketService } from '@kanban/services/ticket.service';
import { SupportRequestResponse } from '@models/support/support-request-response.model';
import { SupportRequestService } from '@services/support/support-request.service';
import { Tag } from 'primeng/tag';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TicketFormComponent } from '@kanban/Components/ticket-form/ticket-form.component';
import { TicketResponse } from '@models/ticket/ticket-response.model';

@Component({
    selector: 'app-requests-list',
    imports: [Button, DatePipe, FormsModule, DropdownModule, DialogModule, NgIf, Tag, Card, NgForOf, TableModule, TicketFormComponent],
    templateUrl: './requests-list.component.html',
    standalone: true,
    styleUrl: './requests-list.component.scss'
})
export class RequestsListComponent implements OnInit, OnDestroy {
    tickets: SupportRequestResponse[] = [];
    loading = false;
    selectedTicket?: SupportRequestResponse;
    visible = false;

    constructor(
        private readonly supportService: SupportRequestService,
        private readonly ticketService: TicketService
    ) {}

    ngOnInit() {
        this.loading = true;
        this.loadSpRequests();
    }

    ngOnDestroy() {
        this.ticketService.clearSelectedTicket();
    }

    showDialog(req: SupportRequestResponse) {
        this.selectedTicket = req;
        this.visible = true;
    }

    acceptReview() {
        if (!this.selectedTicket) return;
        // Transforma la solicitud en un KanbanCard
        const req = this.selectedTicket;
        const card = {
            id: '',
            title: req.titulo,
            description: req.descripcion,
            estado: { id: 1, nombre: '' },
            tipo: { id: 1, nombre: '' },
            prioridad: { id: 1, nombre: '' },
            creationDate: new Date(req.fechaCreacion).toDateString(),
            closureDate: null,
            orderInBoard: 0,
            tags: [],
            progress: null,
            checkList: null,
            attachments: [],
            avatar: [],
            supportRequestId: req.id,
            createdBy: { createdByUserId: '', createdByUserName: '' },
            comments: []
        };

        this.ticketService.setSelectedTicket(card);
        this.visible = false;
    }

    rejectReview() {
        this.visible = false;
        this.selectedTicket = undefined;

        this.loadSpRequests();
    }
    loadSpRequests(){
        this.supportService.getSupportRequests().subscribe({
            next: (data) => {
                this.tickets = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error cargando solicitudes', err);
                this.loading = false;
            }
        });
    }

    onTicketCreated(ticket: TicketResponse) {
        this.tickets = this.tickets.filter(r => r.id !== ticket.supportRequestId);
    }
}
