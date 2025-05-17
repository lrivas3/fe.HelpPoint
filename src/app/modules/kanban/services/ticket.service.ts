import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { TicketRequest, PartialTicketRequest } from '@models/ticket/ticket-request.model';
import { ComentResponse, TicketResponse } from '@models/ticket/ticket-response.model';
import { environment } from '@environments/environment';
import { TicketCommentRequest } from '@models/ticket/ticket-comment-request';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    apiUrl = environment.API_URL;
    private readonly baseUrl = this.apiUrl + '/api/v1/tickets';

    /** Señal para el ticket seleccionado en el formulario */
    selectedTicket: WritableSignal<KanbanCard | null> = signal(null);

    constructor(private readonly http: HttpClient) {}

    /** Establece el ticket actual y muestra el formulario */
    setSelectedTicket(ticket: KanbanCard): void {
        this.selectedTicket.set(ticket);
    }

    /** Limpia el ticket seleccionado y cierra el formulario */
    clearSelectedTicket(): void {
        this.selectedTicket.set(null);
    }

    /** Crea un nuevo ticket en el backend */
    createTicket(ticket: TicketRequest): Observable<TicketResponse> {
        return this.http.post<TicketResponse>(`${this.apiUrl}/api/v1/tickets`, ticket);
    }

    /** Obtiene un ticket por su ID */
    getTicket(id: string): Observable<TicketResponse> {
        return this.http.get<TicketResponse>(`${this.baseUrl}/${id}`);
    }

    /** Obtiene la lista de tickets */
    listTickets(): Observable<TicketResponse[]> {
        return this.http.get<TicketResponse[]>(this.baseUrl);
    }

    /** Actualiza un ticket existente */
    updateTicket(id: string, request: PartialTicketRequest): Observable<TicketResponse> {
        return this.http.put<TicketResponse>(`${this.baseUrl}/${id}`, request);
    }
    addComment(ticketId: string, comment: TicketCommentRequest): Observable<ComentResponse> {
        return this.http.post<ComentResponse>(
            `${this.baseUrl}/${ticketId}/comments`,
            comment
        );
    }
}
