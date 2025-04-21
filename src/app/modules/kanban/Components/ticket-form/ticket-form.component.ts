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
        Id: '',
        Titulo: '',
        Descripcion: null,
        Estado: { Id: this.defaultStateCode, Nombre: '' },
        Tipo: { Id: this.defaultTipoId, Nombre: '' },
        Prioridad: { Id: this.defaultPriorityCode, Nombre: '' },
        FechaCreacion: null,
        FechaCierre: null,
        OrdenEnTablero: 0,
        SupportRequestId: undefined,
        CreatedBy: { CreatedByUserId: '', CreatedByUserName: '' },
        Comments: []
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
        if (!this.selectedTicket.Titulo) {
            this.toastService.show(ToastSeverity.Error, 'Error', 'El título es requerido');
            return;
        }

        // Asegurarnos de que los IDs sean números
        const estadoId = typeof this.selectedTicket.Estado.Id === 'string'
            ? parseInt(this.selectedTicket.Estado.Id)
            : this.selectedTicket.Estado.Id || this.defaultStateCode;

        const prioridadId = typeof this.selectedTicket.Prioridad.Id === 'string'
            ? parseInt(this.selectedTicket.Prioridad.Id)
            : this.selectedTicket.Prioridad.Id || this.defaultPriorityCode;

        const tipoId = typeof this.selectedTicket.Tipo.Id === 'string'
            ? parseInt(this.selectedTicket.Tipo.Id)
            : this.selectedTicket.Tipo.Id || this.defaultTipoId;

        const req: TicketRequest = {
            Titulo: this.selectedTicket.Titulo,
            Descripcion: this.selectedTicket.Descripcion ?? undefined,
            EstadoId: estadoId,
            TipoId: tipoId,
            PrioridadId: prioridadId,
            OrdenEnTablero: this.selectedTicket.OrdenEnTablero,
            SupportRequestId: this.selectedTicket.SupportRequestId
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
