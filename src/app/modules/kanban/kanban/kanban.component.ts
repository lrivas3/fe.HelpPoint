import { Component } from '@angular/core';
import {
    CdkDrag,
    CdkDragDrop,
    CdkDragEnter, CdkDragHandle,
    CdkDropList,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG modules:
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { InplaceModule } from 'primeng/inplace';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputText } from 'primeng/inputtext';

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

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
}

@Component({
    selector: 'app-kanban',
    templateUrl: './kanban.component.html',
    styleUrls: ['./kanban.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        MenuModule,
        TieredMenuModule,
        InplaceModule,
        AvatarModule,
        AvatarGroupModule,
        ProgressBarModule,
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
        InputText
    ]
})
export class KanbanComponent {
    columns: KanbanColumn[] = [
        {
            id: '1',
            title: 'Backlog',
            cards: [
                {
                    id: '22',
                    title: 'Culpa qui officia',
                    description: 'Culpa qui officia deserunt mollit anim id est laborum',
                    progress: 25,
                    checklist: '1 / 4',
                    attachments: 12,
                    dueDate: 'May 25',
                    avatars: [
                        'J',
                        'Q'
                    ]
                },
                {
                    id: '11',
                    title: 'Qualitative resarch planning',
                    description: 'Hey there, we’re just writing to let you know',
                    attachments: 4,
                    dueDate: 'May 17',
                    avatars: [
                        'A',
                        'B'
                    ]
                },
                {
                    id: '12',
                    title: 'Create new components',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                    attachments: 3,
                    dueDate: 'May 21',
                    avatars: [
                        'A',
                        'B'
                    ]
                }
            ]
        },
        {
            id: '2',
            title: 'In Progress',
            cards: []
        }
    ];

    onDropColumn(event: CdkDragDrop<KanbanColumn[]>) {
        // If columns are reorderable:
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }

    // Handler for dropping cards within or between columns.
    onCardDrop(event: CdkDragDrop<KanbanCard[]>, column: KanbanColumn) {
        if (event.previousContainer === event.container) {
            // Same column reorder
            moveItemInArray(column.cards, event.previousIndex, event.currentIndex);
        } else {
            // Different column
            const prevColumn = this.columns.find((col) =>
                col.cards === event.previousContainer.data
            );
            if (!prevColumn) return;
            transferArrayItem(
                prevColumn.cards,
                column.cards,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    addCard(column: KanbanColumn) {
        const newCard: KanbanCard = {
            id: Math.random().toString(36).substring(2, 7),
            title: 'Untitled card'
        };
        column.cards.push(newCard);
    }

    addColumn() {
        const newColumn: KanbanColumn = {
            id: Math.random().toString(36).substring(2, 7),
            title: 'Untitled List',
            cards: []
        };
        this.columns.push(newColumn);
    }

    confirmEdit() {

    }
}
