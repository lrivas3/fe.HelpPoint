import { Component, effect } from '@angular/core';
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
import { Editor } from 'primeng/editor';
import { Avatar } from 'primeng/avatar';
import { InputText } from 'primeng/inputtext';

@Component({
    selector: 'app-ticket-form',
    imports: [
        Dialog,
        Button,
        FormsModule,
        Divider,
        DropdownModule,
        Select,
        DatePipe,
        Tag,
        Editor,
        Avatar,
        InputText,
        NgForOf,
        NgIf
    ],
    templateUrl: './ticket-form.component.html',
    standalone: true,
    styleUrl: './ticket-form.component.scss'
})
export class TicketFormComponent {
    visible: boolean = false;
    selectedTicket: KanbanCard = {
        id: '',
        title: '',
        description: null,
        stateCode: null,
        priorityCode: null,
        creationDate: null,
        closureDate: null,
        tags: []
    };

    priorityOptions: PSelectableModel[] = [];
    comments: any;
    constructor(private ticketService: TicketService,
                public catalogoService: CatalogoServiceService,
                ) {
        effect(() => {
            const ticket = this.ticketService.selectedTicket();
            if (ticket) {
                this.selectedTicket = ticket;
                this.showDialog();
            } else {
                this.selectedTicket = {
                    id: '',
                    title: '',
                    description: null,
                    stateCode: null,
                    priorityCode: null,
                    creationDate: null,
                    closureDate: null,
                    tags: []
                };
            }
        });
    }
    showDialog() {
        this.visible = true;
    }

    saveTicket(): void {
        console.log("saving ticket", this.selectedTicket);

        // this.safeContent = this.domSanitizer.bypassSecurityTrustHtml(this.selectedTicket.description);
        this.visible = false;
        this.ticketService.clearSelectedTicket();

    }
    cancel(): void {
        this.visible = false;
        this.ticketService.clearSelectedTicket();
    }

    removeTag(success: string) {

    }
}
