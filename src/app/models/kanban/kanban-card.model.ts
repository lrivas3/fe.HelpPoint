export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    stateCode?: string;
    priorityCode?: string;
    creationDate?: Date;
    closureDate?: Date;
    tags?: string[];

    progress?: number;
    checklist?: string;
    attachments?: number;
    dueDate?: string;
    avatars?: string[];
}
