export interface KanbanCard {
    id: string;
    title: string;
    description?: string | null;
    stateCode: number;
    tipoId?: number;
    priorityCode?: number | null;
    creationDate?: Date | null;
    closureDate?: Date | null;
    tags?: string[];

    orderInBoard: number;

    progress?: number;
    checklist?: string;
    attachments?: number;
    avatars?: string[];
}
