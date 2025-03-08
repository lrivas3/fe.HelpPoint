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
                {
                    id: '22',
                    title: 'Actualizacion de antivirus en computadoras de la contable',
                    description: 'Some description',
                    progress: 25,
                    attachments: 2,
                    creationDate: new Date(),
                    avatars: ['J', 'Q']
                },
                { id: '11', title: 'Task 2', description: 'Another task', attachments: 1, avatars: ['A', 'B'] }
            ]
        },
        {
            id: '2',
            title: 'In Progress',
            cards: []
        }
    ];

    ngOnInit() {
        console.log(this.columns);
    }


    onDropColumn(event: CdkDragDrop<KanbanColumn[]>) {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

    addColumn() {
        this.columns.push({
            id: Math.random().toString(36).substring(2, 7),
            title: 'Nueva Lista',
            cards: []
        });
    }

    get dropListIds(): string[] {
        return this.columns.map((column) => column.id);
    }
}
