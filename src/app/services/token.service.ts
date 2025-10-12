import { Injectable } from '@angular/core';
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';
import jwt_decode, { JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string) {
    setCookie('token-helppoint', token, { expires: 365, path: '/' });
  }

  getToken() {
    const token = getCookie('token-helppoint');
    return token;
  }

  removeToken() {
    removeCookie('token-helppoint');
  }

  removeRefreshToken() {
    removeCookie('refresh-token-helppoint');
  }

  saveRefreshToken(token: string) {
    setCookie('refresh-token-helppoint', token, { expires: 365, path: '/' });
  }

  getRefreshToken() {
    const token = getCookie('refresh-token-helppoint');
    return token;
  }

  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }

  isValidRefreshToken() {
    const token = this.getRefreshToken();
    if (!token) {
      return false;
    }
    const decodeToken = jwt_decode<JwtPayload>(token);
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp);
      const today = new Date();
      return tokenDate.getTime() > today.getTime();
    }
    return false;
  }
}
