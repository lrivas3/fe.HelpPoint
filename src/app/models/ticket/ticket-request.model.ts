export interface TicketRequest {
    orderInBoard?: number;
    title: string;
    description?: string;
    stateCode: number;
    tipoId?: number;
    priorityCode: number;
    supportRequestId?: string;
}
