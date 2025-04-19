export interface KanbanCard {
    id: string;
    title: string;
    description: string | null;
    stateCode?: string | null;
    priorityCode?: string | null;
    creationDate?: Date | null;
    closureDate?: Date | null;
    tags?: string[];

    progress?: number;
    checklist?: string;
    attachments?: number;
    avatars?: string[];
}
