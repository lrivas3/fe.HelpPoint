export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    progress?: number;
    checklist?: string;
    attachments?: number;
    dueDate?: string;
    avatars?: string[];
}

