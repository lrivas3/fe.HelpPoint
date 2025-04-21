import { LookUpResponse, UserLookUpResponse, ComentResponse } from '@models/ticket/ticket-response.model';

export interface KanbanCard {
    Id: string;
    Titulo: string;
    Descripcion: string | null;
    Estado: LookUpResponse;
    Tipo: LookUpResponse;
    Prioridad: LookUpResponse;
    FechaCreacion: string | null;
    FechaCierre: string | null;
    OrdenEnTablero: number;
    SupportRequestId?: string;
    CreatedBy: UserLookUpResponse;
    Comments: ComentResponse[];
}
