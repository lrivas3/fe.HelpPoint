import { LookUpResponse, UserLookUpResponse, ComentResponse } from '@models/ticket/ticket-response.model';

export interface KanbanCard {
    id: string;
    titulo: string;
    description: string | null;
    estado: LookUpResponse;
    tipo: LookUpResponse;
    prioridad: LookUpResponse;
    fechaCreacion: string | null;
    fechaCierre: string | null;
    ordenEnTablero: number;
    supportRequestId?: string;
    createdBy: UserLookUpResponse;
    comments: ComentResponse[];
}
