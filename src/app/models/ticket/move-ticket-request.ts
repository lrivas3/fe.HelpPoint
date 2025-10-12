export interface ReorderTicket{
    TicketId: string;
    EstadoId: number;
    OrdenEnTablero: number | null;
}

export interface ReorderPayload {
    tickets: ReorderTicket[];
}
