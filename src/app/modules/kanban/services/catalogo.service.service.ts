import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { PSelectableModel } from '@models/prime-components-options/p-selectable.model';
import { checkToken } from '@interceptors/token.interceptor';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceService {
    apiUrl = environment.API_URL;
    estados: WritableSignal<PSelectableModel[]> = signal([]);
    constructor(private http: HttpClient) { }

    getEstados(){
        this.http.get<PSelectableModel[]>(`${this.apiUrl}/api/v1/estados`, {
            context: checkToken()
        }).pipe(
            tap(estados => {
                    this.estados.set(estados);
                }
            )
        ).subscribe();
    }
}
