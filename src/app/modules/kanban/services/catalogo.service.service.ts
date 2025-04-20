import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { PSelectableModel } from '@models/prime-components-options/p-selectable.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogoServiceService {
    apiUrl = environment.API_URL;
    estados: WritableSignal<PSelectableModel[]> = signal([]);

    constructor(private http: HttpClient) {
        this.loadEstados();
    }

    loadEstados() {
        console.log('Cargando estados desde:', `${this.apiUrl}/api/v1/catalogo/estados`);
        this.http.get<PSelectableModel[]>(`${this.apiUrl}/api/v1/catalogo/estados`).pipe(
            tap(estados => {
                console.log('Estados cargados:', estados);
                this.estados.set(estados);
            })
        ).subscribe({
            error: (error) => {
                console.error('Error al cargar estados:', error);
            }
        });
    }

    getEstados() {
        return this.estados();
    }

    getCatalogo() {
        return this.http.get(`${this.apiUrl}/api/v1/catalogo`);
    }
}
