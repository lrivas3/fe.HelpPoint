import { Component } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { KanbanColumnComponent } from '@kanban/Components/kanban-column/kanban-column.component';
import { KanbanColumn } from '@models/kanban/kanban-list.model';

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CdkDropList, KanbanColumnComponent]
})
export class KanbanComponent {
    columns: KanbanColumn[] = [
        {
            id: '1',
            title: 'Backlog',
            cards: [
                { id: '22', title: 'Task 1', description: 'Some description', progress: 25, checklist: '1 / 4', attachments: 2, dueDate: 'May 25', avatars: ['J', 'Q'] },
                { id: '11', title: 'Task 2', description: 'Another task', attachments: 1, dueDate: 'May 17', avatars: ['A', 'B'] }
            ]
        },
        {
            id: '2',
            title: 'In Progress',
            cards: []
        }
    ];

    onDropColumn(event: CdkDragDrop<KanbanColumn[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

    addColumn() {
        this.columns.push({
            id: Math.random().toString(36).substring(2, 7),
            title: 'New List',
            cards: []
        });
    }

    get dropListIds(): string[] {
        return this.columns.map(column => column.id);
    }
}
