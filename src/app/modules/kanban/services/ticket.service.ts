import { Injectable, signal, WritableSignal } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
    selectedTicket: WritableSignal<KanbanCard | null> = signal(null);
    setSelectedTicket(ticket: KanbanCard): void {
        this.selectedTicket.set(ticket);
    }
    clearSelectedTicket(): void {
        this.selectedTicket.set(null);
    }
}
