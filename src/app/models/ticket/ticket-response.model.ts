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
    stateCode: number;
    tipoId?: number | null;
    priorityCode?: number | null;
    creationDate?: string | null;
    closureDate?: string | null;
    orderInBoard: number;
    tags: string[];
    progress?: number | null;
    checklist?: string | null;
    attachments?: number | null;
    avatars: string[];
}
