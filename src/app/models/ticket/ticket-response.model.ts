export interface LookUpResponse {
    id: number;
    nombre: string;
}

export interface UserLookUpResponse {
    CreatedByUserId: string;
    CreatedByUserName: string;
}

export interface ComentResponse {
    Id: string;
    User: UserLookUpResponse;
    Comentario: string;
    FechaCreacion: string;
}

export interface TicketResponse {
    id: string;
    ordenEnTablero?: number;
    titulo: string;
    description?: string | null;
    estado: LookUpResponse;
    tipo: LookUpResponse;
    prioridad: LookUpResponse;
    fechaCreacion: string;
    fechaCierre?: string | null;
    supportRequestId?: string;
    createdBy: UserLookUpResponse;
    comments: ComentResponse[];
}
