import { LookUpResponse, UserLookUpResponse, ComentResponse } from '@models/ticket/ticket-response.model';
import { User } from '@models/user.model';

export interface KanbanCard {
    id: string;
    title: string;
    description: string | null;
    estado: LookUpResponse;
    tipo: LookUpResponse;
    prioridad: LookUpResponse;
    creationDate: string | null;
    closureDate: string | null;
    orderInBoard: number;
    tags: string[];
    progress: number | null;
    checkList: number | null;
    attachments: string[] | null;
    avatar: string[] | null;
    supportRequestId?: string | null;
    createdBy: UserLookUpResponse;
    comments: ComentResponse[];
    assignedUsers?: User[];
}
