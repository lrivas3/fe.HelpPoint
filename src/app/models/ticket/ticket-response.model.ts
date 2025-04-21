export interface LookUpResponse {
    Id: number;
    Nombre: string;
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
    Id: string;
    OrdenEnTablero?: number;
    Titulo: string;
    Descripcion?: string | null;
    Estado: LookUpResponse;
    Tipo: LookUpResponse;
    Prioridad: LookUpResponse;
    FechaCreacion: string;
    FechaCierre?: string | null;
    SupportRequestId?: string;
    CreatedBy: UserLookUpResponse;
    Comments: ComentResponse[];
}
