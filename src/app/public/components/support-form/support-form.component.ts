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

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

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
  styleUrl: './support-form.component.scss'
})
export class SupportFormComponent {

    supportRequest: SupportRequestRequest = { email: '', descripcion: '' };
    loading = false;

    siteKey = environment.recaptchaSiteKey;
    constructor(private config: PrimeNG,
                private supportService: SupportRequestService,
                private toastService: ToastService) {
    }
    uploadedFiles: any[] = [];
    sendSRequest() {
        if (!this.supportRequest.email || !this.supportRequest.descripcion) {
            this.toastService.show(
                ToastSeverity.Warn,
                'Atención',
                'Debe completar email y descripción'
            );
            return;
        }

        this.loading = true;
        this.supportService.createSupportRequest(this.supportRequest)
            .subscribe({
                next: (res) => {
                    this.toastService.show(
                        ToastSeverity.Success,
                        'Éxito',
                        'Solicitud enviada correctamente'
                    );
                    // Limpiar formulario
                    this.supportRequest = { email: '', descripcion: '' };
                    this.loading = false;
                },
                error: (err) => {
                    console.error(err);
                    this.toastService.show(
                        ToastSeverity.Error,
                        'Error',
                        'No se pudo enviar la solicitud'
                    );
                    this.loading = false;
                }
            });
    }

    executeRecaptcha(token: any) {
        console.log(token);
    }

    onUpload(event: FileUploadEvent) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.toastService.show(ToastSeverity.Info, 'Exito', 'Archivo subido con exito');
    }

    choose({ event, callback }: { event: any, callback: any }) {
        callback();
    }
}
