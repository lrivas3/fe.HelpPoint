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
}
