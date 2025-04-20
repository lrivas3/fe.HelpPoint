import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/api/v1/users`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${this.apiUrl}/api/v1/users/${id}`);
  }

  getProfile() {
    return this.http.get<User>(`${this.apiUrl}/api/v1/user/profile`);
  }
}
