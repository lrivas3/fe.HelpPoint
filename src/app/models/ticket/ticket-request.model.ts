export interface TicketRequest {
    OrdenEnTablero?: number;
    Titulo: string;
    Descripcion?: string;
    EstadoId: number;
    TipoId: number;
    PrioridadId: number;
    SupportRequestId?: string;
}

export interface PartialTicketRequest {
    OrdenEnTablero?: number;
    Titulo?: string;
    Descripcion?: string;
    EstadoId?: number;
    TipoId?: number;
    PrioridadId?: number;
    SupportRequestId?: string;
}
