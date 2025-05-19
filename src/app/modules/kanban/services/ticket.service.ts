import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { TicketRequest, PartialTicketRequest } from '@models/ticket/ticket-request.model';
import { ComentResponse, TicketResponse } from '@models/ticket/ticket-response.model';
import { environment } from '@environments/environment';
import { TicketCommentRequest } from '@models/ticket/ticket-comment-request';
import { ReorderPayload, ReorderTicket } from '@models/ticket/move-ticket-request';

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly apiUrl   = environment.API_URL;
    private readonly baseUrl  = `${this.apiUrl}/api/v1/tickets`;

    // 1) Subject para notificar cambios
    private readonly _ticketsChanged$ = new BehaviorSubject<void>(void 0);
    ticketsChanged$ = this._ticketsChanged$.asObservable();

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
    createTicket(request: TicketRequest): Observable<TicketResponse> {
        return this.http
            .post<TicketResponse>(this.baseUrl, request)
            .pipe(
                tap(() => this._ticketsChanged$.next())
            );
    }

    /** Obtiene un ticket por su ID */
    getTicket(id: string): Observable<TicketResponse> {
        return this.http.get<TicketResponse>(`${this.baseUrl}/${id}`);
    }

    /** Obtiene la lista de tickets para Kanban */
    listTicketsForKanban(): Observable<KanbanCard[]> {
        return this.http.get<KanbanCard[]>(`${this.baseUrl}`);
    }

    /** Actualiza un ticket existente */
    updateTicket(id: string, request: PartialTicketRequest): Observable<TicketResponse> {
        return this.http
            .put<TicketResponse>(`${this.baseUrl}/${id}`, request)
            .pipe(
                tap(() => this._ticketsChanged$.next())
            );
    }

    /** Agrega un comentario a un ticket */
    addComment(ticketId: string, comment: TicketCommentRequest): Observable<ComentResponse> {
        return this.http
            .post<ComentResponse>(`${this.baseUrl}/${ticketId}/comments`, comment)
            .pipe(
                tap(() => this._ticketsChanged$.next())
            );
    }

    /** Mueve los tickets de estado (en el dashboard)*/
    moveTicket(payload: ReorderPayload): Observable<any>{
        return this.http.put(`${this.baseUrl}/reorder`, payload)
    }
}
