import { Component, Input } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InplaceModule } from 'primeng/inplace';
import { KanbanCardComponent } from '@kanban/Components/kanban-card/kanban-card.component';
import { KanbanColumn } from '@models/kanban/kanban-list.model';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';

@Component({
    selector: 'app-kanban-column',
    templateUrl: './kanban-column.component.html',
    styleUrls: ['./kanban-column.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InplaceModule, CdkDropList, KanbanCardComponent, InputText, CdkDrag, Menu]
})
export class KanbanColumnComponent {
    @Input() column!: KanbanColumn;

    items: MenuItem[] | undefined;

    ngOnInit(){
        this.items = [
            {
                label: 'Opciones',
                items: [
                    {
                        label: 'Refrescar',
                        icon: 'pi pi-refresh',
                        command: () => this.refreshColumn()
                    },
                    {
                        label: 'Eliminar',
                        icon: 'pi pi-trash',
                        command: () => this.deleteColumn()
                    }
                ]
            }
        ];
    }

    onCardDrop(event: CdkDragDrop<KanbanCard[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(this.column.cards, event.previousIndex, event.currentIndex);
        } else {
            const prevColumn = event.previousContainer.data as KanbanCard[];
            transferArrayItem(prevColumn, this.column.cards, event.previousIndex, event.currentIndex);
        }
    }

    addCard() {
        this.column.cards.push({ id: Math.random().toString(36).substring(2, 7), title: 'New Card' });
    }

    private refreshColumn() {

    }

    private deleteColumn() {

    }

    confirmEdit() {

    }
}
