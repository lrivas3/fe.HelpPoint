export interface LookUpResponse {
    id: number;
    nombre: string;
}

export interface UserLookUpResponse {
    createdByUserId: string;
    createdByUserName: string;
}

export interface ComentResponse {
    id: string;
    user: UserLookUpResponse;
    comentario: string;
    fechaCreacion: string;
}

export interface TicketResponse {
    id: string;
    ordenEnTablero?: number;
    titulo: string;
    descripcion?: string;
    estado: LookUpResponse;
    tipo: LookUpResponse;
    prioridad: LookUpResponse;
    fechaCreacion: string;
    fechaCierre?: string;
    supportRequestId?: string;
    createdBy: UserLookUpResponse;
    comments: ComentResponse[];
}
