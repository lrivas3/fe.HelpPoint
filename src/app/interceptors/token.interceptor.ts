import {
    HttpRequest,
    HttpHandlerFn,
    HttpEvent,
    HttpContext,
    HttpContextToken,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { TokenService } from '@services/token.service';
import { AuthService } from '@services/auth.service';
import { inject } from '@angular/core';

const SKIP_TOKEN_CHECK = new HttpContextToken<boolean>(() => false);

export function skipTokenCheck() {
    return new HttpContext().set(SKIP_TOKEN_CHECK, true);
}

export const tokenInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);

    if (!req.context.get(SKIP_TOKEN_CHECK)) {
        const isValidToken = tokenService.isValidToken();
        if (isValidToken) {
            return addToken(req, next, tokenService);
        } else {
            return updateAccessTokenAndRefreshToken(req, next, tokenService, authService);
        }
    }
    return next(req);
};

const addToken = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    tokenService: TokenService
): Observable<HttpEvent<unknown>> => {
    const accessToken = tokenService.getToken();
    if (accessToken) {
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        return next(authRequest);
    }
    return next(req);
};

const updateAccessTokenAndRefreshToken = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    tokenService: TokenService,
    authService: AuthService
): Observable<HttpEvent<unknown>> => {
    const refreshToken = tokenService.getRefreshToken();
    const isValidRefreshToken = tokenService.isValidRefreshToken();
    if (refreshToken && isValidRefreshToken) {
        return authService.refreshToken(refreshToken).pipe(
            switchMap(() => addToken(req, next, tokenService))
        );
    }
    return next(req);
};
