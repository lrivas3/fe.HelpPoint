export interface TicketRequest {
    ordenEnTablero?: number;
    titulo: string;
    descripcion?: string;
    estadoId: number;
    tipoId?: number;
    prioridadId: number;
    supportRequestId?: string;
}
