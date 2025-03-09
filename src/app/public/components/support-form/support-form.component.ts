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
    siteKey = environment.recaptchaSiteKey;
    constructor(private config: PrimeNG,private toastService: ToastService) {
    }
    dropdownItem: any;
    dropdownItems: any[] | undefined;
    uploadedFiles: any[] = [];

    sendSRequest() {

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
