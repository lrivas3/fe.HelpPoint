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
    title: string;
    description?: string | null;
    estado: LookUpResponse;
    tipo: LookUpResponse;
    prioridad: LookUpResponse;
    creationDate: string;
    closureDate?: string | null;
    orderInBoard?: number;
    tags: string[];
    progress: number | null;
    checkList: number | null;
    attachments: string[] | null;
    avatar: string[] | null;
    supportRequestId?: string;
    createdBy: UserLookUpResponse;
    comments: ComentResponse[];
}
