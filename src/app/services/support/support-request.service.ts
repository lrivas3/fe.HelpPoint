import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportRequestRequest } from '@models/support/support-request-request.model';
import { SupportRequestResponse } from '@models/support/support-request-response.model';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class SupportRequestService {
    private readonly baseUrl = `${environment.API_URL}/api/v1/supports`;

    constructor(private readonly http: HttpClient) {}

    createSupportRequest(payload: SupportRequestRequest): Observable<SupportRequestResponse> {
        return this.http.post<SupportRequestResponse>(this.baseUrl, payload);
    }
    getSupportRequests(): Observable<SupportRequestResponse[]> {
        return this.http.get<SupportRequestResponse[]>(this.baseUrl);
    }
}
