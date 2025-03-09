import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';
import { NgIf } from '@angular/common';
import { ButtonComponent } from '@shared/button/button.component';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-login-form',
    imports: [ReactiveFormsModule, NgIf, ButtonComponent, InputGroup, InputGroupAddon, InputText, Button, Divider],
    standalone: true,
    templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
    form: FormGroup;
    status: RequestStatus = 'init';
    showPassword = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute
    ) {
        this.form = this.formBuilder.nonNullable.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    doLogin() {
        if (this.form.valid) {
            this.status = 'loading';
            const { email, password } = this.form.getRawValue();
            this.authService.login(email, password).subscribe({
                next: () => {
                    this.status = 'success';
                    this.router.navigate(['/']);
                },
                error: () => {
                    this.status = 'failed';
                }
            });
        } else {
            this.form.markAllAsTouched();
        }
    }

    // getters
    get passwordControl() {
        return this.form.get('password');
    }

    get emailControl() {
        return this.form.get('email');
    }
}
