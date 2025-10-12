export interface Attachment {
    name: string;
    url:  string;
}

export interface SupportRequestResponse {
    id: string;
    titulo: string;
    descripcion: string;
    nombreEstado: string;
    fechaCreacion: string;
    fechaResolucion?: string;
    empleadoId?: string;
    email: string;
    tokenVerificacion: boolean;
    attachments?: Attachment[];
}
