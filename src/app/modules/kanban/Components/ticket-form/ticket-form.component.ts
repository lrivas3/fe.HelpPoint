import { Component, effect, Output, EventEmitter } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { TicketService } from '@kanban/services/ticket.service';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { FormsModule } from '@angular/forms';
import { Divider } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PSelectableModel } from '@models/prime-components-options/p-selectable.model';
import { CatalogoServiceService } from '@kanban/services/catalogo.service.service';
import { Select } from 'primeng/select';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { TicketResponse } from '@models/ticket/ticket-response.model';
import { TicketRequest } from '@models/ticket/ticket-request.model';
import { ToastService } from '@services/toast.service';
import { ToastSeverity } from '@models/toast-severity';

@Component({
    selector: 'app-ticket-form',
    imports: [Dialog, Button, FormsModule, Divider, DropdownModule, Select, DatePipe, Tag, Avatar, InputText, NgForOf, NgIf, Textarea],
    templateUrl: './ticket-form.component.html',
    standalone: true,
    styleUrl: './ticket-form.component.scss'
})
export class TicketFormComponent {
    @Output() ticketCreated = new EventEmitter<TicketResponse>();
    visible: boolean = false;
    defaultStateCode: number = 1;
    defaultPriorityCode: number = 2;
    defaultTipoId: number = 1;

    selectedTicket: KanbanCard = {
        id: '',
        titulo: '',
        descripcion: null,
        estado: { id: this.defaultStateCode, nombre: '' },
        tipo: { id: this.defaultTipoId, nombre: '' },
        prioridad: { id: this.defaultPriorityCode, nombre: '' },
        fechaCreacion: null,
        fechaCierre: null,
        ordenEnTablero: 0,
        supportRequestId: undefined,
        createdBy: { CreatedByUserId: '', CreatedByUserName: '' },
        comments: []
    };

    priorityOptions: PSelectableModel[] = [];
    comments: any;

    constructor(
        private readonly ticketService: TicketService,
        public catalogoService: CatalogoServiceService,
        private readonly toastService: ToastService
    ) {
        effect(() => {
            const ticket = this.ticketService.selectedTicket();
            if (ticket) {
                this.selectedTicket = ticket;
                this.showDialog();
            }
        });
    }

    showDialog() {
        this.visible = true;
    }

    saveTicket(): void {
        if (!this.selectedTicket.titulo) {
            this.toastService.show(ToastSeverity.Error, 'Error', 'El título es requerido');
            return;
        }

        const estadoId = this.selectedTicket.estado.id || this.defaultStateCode;

        const prioridadId = this.selectedTicket.prioridad.id || this.defaultPriorityCode;

        const tipoId = this.selectedTicket.tipo.id || this.defaultTipoId;

        const req: TicketRequest = {
            Titulo: this.selectedTicket.titulo,
            Descripcion: this.selectedTicket.descripcion ?? undefined,
            EstadoId: estadoId,
            TipoId: tipoId,
            PrioridadId: prioridadId,
            OrdenEnTablero: this.selectedTicket.ordenEnTablero,
            SupportRequestId: this.selectedTicket.supportRequestId
        };

        console.log('Creando ticket con request:', req);

        this.ticketService.createTicket(req).subscribe({
            next: (t: TicketResponse) => {
                console.log('Ticket creado:', t);
                this.ticketCreated.emit(t);
                this.visible = false;
                this.ticketService.clearSelectedTicket();
                this.toastService.show(ToastSeverity.Success, 'Éxito', 'Ticket creado exitosamente');
            },
            error: err => {
                console.error('Error al crear ticket', err);
                this.toastService.show(ToastSeverity.Error, 'Error', 'Error al crear el ticket. Por favor, intente nuevamente.');
            }
        });
    }

    cancel(): void {
        this.visible = false;
        this.ticketService.clearSelectedTicket();
    }

    removeTag(success: string) {}

}
