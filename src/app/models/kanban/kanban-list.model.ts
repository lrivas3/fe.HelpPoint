import { KanbanCard } from '@models/kanban/kanban-card.model';

export interface KanbanColumn {
    cards: KanbanCard[];
    id: string;
    title: string;
}
