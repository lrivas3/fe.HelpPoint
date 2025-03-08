import { Component, Input } from '@angular/core';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { Avatar } from 'primeng/avatar';
import { AvatarGroup } from 'primeng/avatargroup';
import { Button } from 'primeng/button';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { NgForOf, NgIf } from '@angular/common';
import { ProgressBar } from 'primeng/progressbar';

@Component({
    selector: 'app-kanban-card',
    imports: [Avatar, AvatarGroup, Button, CdkDrag, CdkDragHandle, NgForOf, NgIf, ProgressBar],
    templateUrl: './kanban-card.component.html',
    styleUrl: './kanban-card.component.scss'
})
export class KanbanCardComponent {
    @Input() ticketCard!: KanbanCard;
}
