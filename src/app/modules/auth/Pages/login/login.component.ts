import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../layout/component/app.floatingconfigurator';
import { LoginFormComponent } from '../../Components/login-form/login-form.component';
import { SvgIconComponent } from '@shared/Icon/svg-icon/svg-icon.component';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, LoginFormComponent, SvgIconComponent, Divider],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    constructor(private router: Router) {}
    email: string = '';

    password: string = '';

    checked: boolean = false;
    protected readonly status = status;

    goToSupport() {
        this.router.navigate(['/support/request']);
    }
}
