import { Component } from '@angular/core';
import { Fluid } from 'primeng/fluid';
import { Button, ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SvgIconComponent } from '@shared/Icon/svg-icon/svg-icon.component';
import { Textarea } from 'primeng/textarea';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { FileUpload, FileUploadEvent } from 'primeng/fileupload';
import { NgForOf, NgIf } from '@angular/common';
import { ToastService } from '@services/toast.service';
import { ToastSeverity } from '@models/toast-severity';
import { PrimeNG } from 'primeng/config';
import { RecaptchaModule } from 'ng-recaptcha';
import { environment } from '@environments/environment';
import { SupportRequestService } from '@services/support/support-request.service';
import { SupportRequestRequest } from '@models/support/support-request-request.model';

@Component({
    selector: 'app-support-form',
    imports: [
        Fluid,
        InputText,
        FormsModule,
        SvgIconComponent,
        Textarea,
        AppFloatingConfigurator,
        ButtonDirective,
        FileUpload,
        NgIf,
        NgForOf,
        Button,
        RecaptchaModule
    ],
    templateUrl: './support-form.component.html',
    styleUrls: ['./support-form.component.scss']
})
export class SupportFormComponent {
    supportRequest: SupportRequestRequest = { email: '', descripcion: '' };
    loading = false;

    // reCAPTCHA state
    captchaResolved = false;
    recaptchaToken: string | null = null;

    siteKey = environment.recaptchaSiteKey;

    uploadedFiles: any[] = [];

    constructor(
        private config: PrimeNG,
        private supportService: SupportRequestService,
        private toastService: ToastService
    ) {}

    sendSRequest() {
        // Ensure captcha completed
        if (!this.captchaResolved) {
            this.toastService.show(
                ToastSeverity.Warn,
                'Atención',
                'Por favor completa el captcha.'
            );
            return;
        }

        // Validate form fields
        if (!this.supportRequest.email || !this.supportRequest.descripcion) {
            this.toastService.show(
                ToastSeverity.Warn,
                'Atención',
                'Debe completar email y descripción'
            );
            return;
        }

        this.loading = true;
        // Send support request (token included if backend expects it)
        const payload: any = { ...this.supportRequest };
        if (this.recaptchaToken) payload.tokenVerificacion = this.recaptchaToken;

        this.supportService.createSupportRequest(payload)
            .subscribe({
                next: (res) => {
                    this.toastService.show(
                        ToastSeverity.Success,
                        'Éxito',
                        'Solicitud enviada correctamente'
                    );
                    this.supportRequest = { email: '', descripcion: '' };
                    this.captchaResolved = false;
                    this.recaptchaToken = null;
                    this.loading = false;
                },
                error: () => {
                    // Interceptor handles toast; just reset loading
                    this.loading = false;
                }
            });
    }

    executeRecaptcha(token: string | null) {
        this.recaptchaToken = token;
        this.captchaResolved = !!token;
    }

    onUpload(event: FileUploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.toastService.show(
            ToastSeverity.Info,
            'Éxito',
            'Archivo subido con éxito'
        );
    }

    choose({ event, callback }: { event: any; callback: () => void }) {
        callback();
    }
}
