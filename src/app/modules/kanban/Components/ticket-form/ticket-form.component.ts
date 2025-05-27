import { Component, effect, Output, EventEmitter, OnInit } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Button, ButtonDirective } from 'primeng/button';
import { TicketService } from '@kanban/services/ticket.service';
import { KanbanCard } from '@models/kanban/kanban-card.model';
import { FormsModule } from '@angular/forms';
import { Divider } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { PSelectableModel, PSelectableStrModel } from '@models/prime-components-options/p-selectable.model';
import { CatalogoServiceService } from '@kanban/services/catalogo.service.service';
import { Select } from 'primeng/select';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Avatar } from 'primeng/avatar';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ComentResponse, TicketResponse } from '@models/ticket/ticket-response.model';
import { PartialTicketRequest, TicketRequest } from '@models/ticket/ticket-request.model';
import { ToastService } from '@services/toast.service';
import { ToastSeverity } from '@models/toast-severity';
import { TicketCommentRequest } from '@models/ticket/ticket-comment-request';
import { Tooltip } from 'primeng/tooltip';
import { UsersService } from '@services/users.service';
import { MultiSelect } from 'primeng/multiselect';
import {User} from "@models/user.model";

@Component({
    selector: 'app-ticket-form',
    standalone: true,
    imports: [Dialog, Button, FormsModule, Divider, DropdownModule, Select, DatePipe, Tag, Avatar, InputText, NgForOf, Textarea, Tooltip, ButtonDirective, NgIf, MultiSelect],
    templateUrl: './ticket-form.component.html',
    styleUrl: './ticket-form.component.scss'
})
export class TicketFormComponent implements OnInit {
    @Output() ticketCreated = new EventEmitter<TicketResponse>();
    @Output() ticketDeleted = new EventEmitter<string>();

    /** Control del diálogo */
    visible = false;

    /** Valores por defecto */
    defaultStateCode = 1;
    defaultPriorityCode = 2;
    defaultTipoId = 1;

    /** Texto del nuevo comentario */
    commentText = '';

    /** El ticket original (inmutable en el modal) */
    selectedTicket: KanbanCard = {
        id: '',
        title: '',
        description: null,
        estado: { id: this.defaultStateCode, nombre: '' },
        tipo: { id: this.defaultTipoId, nombre: '' },
        prioridad: { id: this.defaultPriorityCode, nombre: '' },
        creationDate: null,
        closureDate: null,
        orderInBoard: 0,
        tags: [],
        progress: null,
        checkList: null,
        attachments: [],
        avatar: [],
        supportRequestId: null,
        createdBy: { createdByUserId: '', createdByUserName: '' },
        comments: []
    };

    /** Copia profunda para edición */
    workingTicket: KanbanCard = { ...this.selectedTicket };

    /** Opciones para selects */
    estadosOptions: PSelectableModel[] = [];
    priorityOptions: PSelectableModel[] = [];
    usersOptions: PSelectableStrModel[] = [];
    multiselectVisible = false;
    selectedUserIds: string[] = [];
    protected loading: boolean = false;

    constructor(
        private readonly ticketService: TicketService,
        public readonly catalogoService: CatalogoServiceService,
        private readonly toastService: ToastService,
        private readonly usersService: UsersService
    ) {
        // Al recibir un ticket, clonar y abrir diálogo
        effect(() => {
            const ticket = this.ticketService.selectedTicket();
            if (ticket) {
                this.selectedTicket = ticket;
                // deep clone para aislar cambios
                this.workingTicket = JSON.parse(JSON.stringify(ticket));
                this.commentText = '';

                // Cargar usuarios asignados si el ticket tiene ID
                if (ticket.id) {
                    this.loadAssignedUsers();
                } else {
                    this.selectedUserIds = [];
                }

                this.showDialog();
            }
        });
    }

    ngOnInit(): void {
        // Cargar catálogo de estados y prioridades
        this.catalogoService.getEstados().subscribe((estados) => {
            this.estadosOptions = estados;
        });
        this.catalogoService.getPrioridades().subscribe((prioridades) => {
            this.priorityOptions = prioridades;
        });

        // Cargar usuarios disponibles
        this.loadAvailableUsers();
    }

    /**
     * Carga la lista de usuarios disponibles para asignar
     */
    loadAvailableUsers(): void {
        this.usersService.getUsers().subscribe({
            next: (users) => {
                this.usersOptions = users.map((user) => ({
                    label: `${user.name} ${user.lastName}`,
                    value: user.id
                }));

                // Si hay un ticket seleccionado, cargar sus usuarios asignados
                if (this.workingTicket.id) {
                    this.loadAssignedUsers();
                }
            },
            error: (err) => {
                console.error('Error al cargar usuarios', err);
                this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudieron cargar los usuarios');
            }
        });
    }

    /**
     * Carga los usuarios asignados al ticket actual
     */
    loadAssignedUsers(): void {
        if (!this.workingTicket.id) return;

        this.ticketService.listAssignedUsers(this.workingTicket.id).subscribe({
            next: (users) => {
                this.workingTicket.assignedUsers = users || [];
                this.selectedUserIds = users.map((user) => user.id);
            },
            error: (err) => {
                console.error('Error al cargar usuarios asignados', err);
                this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudieron cargar los usuarios asignados');
            }
        });
    }

    /**
     * Llamado siempre que cambie la selección en el multiselect.
     * Envía la lista completa de selectedUserIds al backend.
     */
    onUserSelectionChange(): void {
        if (!this.workingTicket.id) {
            return;
        }
        this.ticketService
            .assignUsers(this.workingTicket.id, this.selectedUserIds)
            .subscribe({
                next: (users: User[]) => {
                    this.workingTicket.assignedUsers = users;
                    this.toastService.show(
                        ToastSeverity.Success,
                        'Éxito',
                        'Asignación de usuarios actualizada'
                    );
                },
                error: () => {
                    this.toastService.show(
                        ToastSeverity.Error,
                        'Error',
                        'No se pudo actualizar la asignación de usuarios'
                    );
                }
            });
    }

    showDialog(): void {
        this.visible = true;
    }

    cancel(): void {
        // Cerrar sin aplicar cambios
        this.visible = false;
        this.ticketService.clearSelectedTicket();
    }

    saveTicket(): void {
        // 1) Validar título
        if (!this.workingTicket.title?.trim()) {
            this.toastService.show(ToastSeverity.Error, 'Error', 'El título es requerido');
            return;
        }

        // 2) IDs con fallback
        const estadoId = this.workingTicket.estado?.id ?? this.defaultStateCode;
        const tipoId = this.workingTicket.tipo?.id ?? this.defaultTipoId;
        const prioridadId = this.workingTicket.prioridad?.id ?? this.defaultPriorityCode;

        // 3) Crear DTO base para update
        const baseReq: PartialTicketRequest = {
            Titulo: this.workingTicket.title.trim(),
            Descripcion: this.workingTicket.description?.trim() ?? undefined,
            EstadoId: estadoId,
            TipoId: tipoId,
            PrioridadId: prioridadId,
            OrdenEnTablero: this.workingTicket.orderInBoard,
            SupportRequestId: this.workingTicket.supportRequestId ?? null,
            FechaCierre: estadoId === 3 ? new Date().toISOString() : null
        };

        if (this.workingTicket.id) {
            // ==== ACTUALIZAR ====
            this.ticketService.updateTicket(this.workingTicket.id, baseReq).subscribe({
                next: (updated: TicketResponse) => {
                    // Aplicar cambios al original
                    Object.assign(this.selectedTicket, updated);
                    this.toastService.show(ToastSeverity.Success, 'Éxito', 'Ticket actualizado');
                    this.visible = false;
                    this.ticketService.clearSelectedTicket();
                    this.ticketCreated.emit(updated);
                },
                error: (err) => {
                    console.error('Error al actualizar ticket', err);
                    this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudo actualizar el ticket');
                }
            });
        } else {
            // ==== CREAR ====
            const createReq: TicketRequest = {
                Titulo: baseReq.Titulo!,
                Descripcion: baseReq.Descripcion,
                EstadoId: baseReq.EstadoId!,
                TipoId: baseReq.TipoId!,
                PrioridadId: baseReq.PrioridadId!,
                OrdenEnTablero: baseReq.OrdenEnTablero!,
                SupportRequestId: baseReq.SupportRequestId
            };
            this.ticketService.createTicket(createReq).subscribe({
                next: (created: TicketResponse) => {
                    this.toastService.show(ToastSeverity.Success, 'Éxito', 'Ticket creado exitosamente');
                    this.visible = false;
                    this.ticketService.clearSelectedTicket();
                    this.ticketCreated.emit(created);
                },
                error: (err) => {
                    console.error('Error al crear ticket', err);
                    this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudo crear el ticket');
                }
            });
        }
    }

    addComment(): void {
        const text = this.commentText.trim();
        if (!text) {
            this.toastService.show(ToastSeverity.Error, 'Error', 'El comentario no puede estar vacío');
            return;
        }
        const req: TicketCommentRequest = { Comentario: text };
        this.ticketService.addComment(this.workingTicket.id, req).subscribe({
            next: (c: ComentResponse) => {
                // Inserta en la copia para previsualizar
                this.workingTicket.comments.push(c);
                this.commentText = '';
                this.toastService.show(ToastSeverity.Success, '¡Listo!', 'Comentario agregado');
            },
            error: (err) => {
                console.error('Error al agregar comentario', err);
                this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudo agregar el comentario');
            }
        });
    }

    removeTag(success: string) {}
    deleteTicket(): void {
        if (!this.workingTicket.id) return;
        this.loading = true;
        this.ticketService.deleteTicket(this.workingTicket.id).subscribe({
            next: () => {
                this.toastService.show(ToastSeverity.Success, 'Eliminado', 'El ticket ha sido borrado');
                this.loading = false;
                this.visible = false;
                this.ticketService.clearSelectedTicket();
                this.ticketDeleted.emit(this.workingTicket.id);
            },
            error: () => {
                this.toastService.show(ToastSeverity.Error, 'Error', 'No se pudo eliminar el ticket');
                this.loading = false;
            }
        });
    }
}
