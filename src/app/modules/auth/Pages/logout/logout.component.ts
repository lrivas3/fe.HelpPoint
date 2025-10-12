import { Component } from '@angular/core';
import { TokenService } from '@services/token.service';

@Component({
    selector: 'app-logout',
    imports: [],
    template: ``
})
export class LogoutComponent {
    constructor(private tokenService: TokenService) {
    }

    logOut(): void {
        this.tokenService.removeToken();
        this.tokenService.removeRefreshToken();
    }
}
