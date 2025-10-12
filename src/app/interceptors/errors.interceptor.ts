import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService, ToastSeverity } from '@services/toast.service';
import { catchError, Observable, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const toast = inject(ToastService);

    return next(req).pipe(
        catchError(err => {
            let message = 'Ocurrió un error desconocido';

            if (err.error) {
                const body = err.error;
                if (body.detail) {
                    message = body.detail;
                } else if (body.errorMessage) {
                    message = body.errorMessage;
                } else if (body.errors && typeof body.errors === 'object') {
                    message = Object.values(body.errors).flat().join('\n');
                } else if (typeof body === 'string') {
                    message = body;
                }
            }

            toast.show(
                ToastSeverity.Error,
                `Error ${err.status}`,
                message
            );

            return throwError(() => err);
        })
    );
};
