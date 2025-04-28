import { Component, OnInit } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { Button, ButtonDirective } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputText } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { TicketFormComponent } from '@kanban/Components/ticket-form/ticket-form.component';
import { TicketService } from '@kanban/services/ticket.service';
import { KanbanCard } from '@models/kanban/kanban-card.model';

@Component({
    selector: 'app-requests-list',
    imports: [TableModule, Button, IconField, InputIcon, DatePipe, NgClass, FormsModule, DropdownModule, InputText, ButtonDirective, Dialog, NgIf, TicketFormComponent],
    templateUrl: './requests-list.component.html',
    standalone: true,
    styleUrl: './requests-list.component.scss'
})
export class RequestsListComponent implements OnInit {
    reviewDialogVisible: boolean = false;
    visible: boolean = false;
    selectedTicket: any = null;
    tickets!: any[];

    representatives!: any[];

    statuses!: any[];

    loading: boolean = true;

    activityValues: number[] = [0, 100];

    searchValue: string | undefined;

    constructor(private readonly ticketService: TicketService) {}

    ngOnInit() {
        this.loading = false;
        // this.customerService.getCustomersLarge().then((customers) => {
        //     this.customers = customers;
        //     this.loading = false;
        //
        //     this.customers.forEach((customer) => (customer.date = new Date(<Date>customer.date)));
        // });

        this.tickets = [
            { titulo: 'Soporte para la unidad financiera', descripcion: 'peticion de soporte', fecha: '2030230', verified: true, prioridad: 'alta'},
            { titulo: 'Cambio de monitor', descripcion: 'se arruino mi monitor', fecha: '2030230', verified: true, prioridad: 'alta' },
            { titulo: 'Cambio de teclado', descripcion: 'peticion de soporte', fecha: '2030230', verified: true, prioridad: 'alta' },
            { titulo: 'Problemas de red', descripcion: 'peticion de soporte', fecha: '2030230', verified: true, prioridad: 'alta' },
            { titulo: 'Mala conexion', descripcion: 'peticion de soporte', fecha: '2030230', verified: true, prioridad: 'alta' },
            { titulo: 'Renovacion de licencia', descripcion: 'peticion de soporte', fecha: '2030230', verified: true, prioridad: 'alta' },
        ]

        this.representatives = [
            { name: 'Amy Elsner', image: 'amyelsner.png' },
            { name: 'Anna Fali', image: 'annafali.png' },
            { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
            { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
            { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
            { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
            { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
            { name: 'Onyama Limba', image: 'onyamalimba.png' },
            { name: 'Stephen Shaw', image: 'stephenshaw.png' },
            { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
        ];

        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    clear(table: Table) {
        table.clear();
        this.searchValue = '';
    }

    // getSeverity(status: string) {
    //     switch (status.toLowerCase()) {
    //         case 'unqualified':
    //             return 'danger';
    //
    //         case 'qualified':
    //             return 'success';
    //
    //         case 'new':
    //             return 'info';
    //
    //         case 'negotiation':
    //             return 'warn';
    //
    //         case 'renewal':
    //             return null;
    //     }
    // }
    getSeverity(label: string | null | undefined | BufferSource | HTMLLabelElement) {
        return undefined;
    }

    showDialog(ticket: any) {
        this.selectedTicket = ticket;
        this.visible = true;
    }
    acceptReview() {
        const req: any = this.selectedTicket;
        const card: KanbanCard = {
            Id: '',
            Titulo: req.titulo,
            Descripcion: req.descripcion,
            // TODO: traer el estado pero con el servicio de estados
            Estado:       { Id: 1, Nombre: 'New' },     // o el estado que quieras por defecto
            Tipo:         { Id: 1, Nombre: 'General' }, // idem
            Prioridad:    { Id: 2, Nombre: req.prioridad },
            FechaCreacion: new Date().toDateString(),
            FechaCierre:   null,
            OrdenEnTablero: 0,
            SupportRequestId: req.id,       // si tu request lleva un id
            CreatedBy:    { CreatedByUserId: '', CreatedByUserName: '' },
            Comments:     []
        };

        // 1) setea el KanbanCard completo en el servicio…
        this.ticketService.setSelectedTicket(card);
        // 2) cierra el modal de revisión
        this.visible = false;
        this.selectedTicket = null;
    }

    rejectReview() {
        this.visible = false;
        this.selectedTicket = null;
    }

    // Opcional: manejar cuando el ticket ya fue creado
    onTicketCreated(event: any) {
        console.log('Ticket creado desde RequestsList:', event);
        // ...por ejemplo eliminar la request de la lista
        this.tickets = this.tickets.filter(r => r.id !== event.id);
    }

    private closeDialog() {
        this.visible = false;
        this.selectedTicket = null;
    }
}
