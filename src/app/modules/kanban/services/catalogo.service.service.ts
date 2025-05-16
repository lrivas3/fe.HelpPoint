import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { PSelectableModel } from '@models/prime-components-options/p-selectable.model';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs'; // Import BehaviorSubject and Observable
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CatalogoServiceService {
    apiUrl = environment.API_URL;
    private estadosSubject = new BehaviorSubject<PSelectableModel[]>([]);
    public estados$ = this.estadosSubject.asObservable();
    private estadosCache: PSelectableModel[] | null = null; // Cache

    constructor(private http: HttpClient) {
        this.loadEstados();
    }

    loadEstados() {
        if (this.estadosCache) {
            this.estadosSubject.next(this.estadosCache); // If cached, emit immediately
        } else {
            this.http.get<PSelectableModel[]>(`${this.apiUrl}/api/v1/catalogo/estados`).pipe(
                tap(estados => {
                    this.estadosCache = estados;
                    this.estadosSubject.next(estados);
                })
            ).subscribe({
                error: (error) => {
                    console.error('Error al cargar estados:', error);
                }
            });
        }
    }

    getEstados(): Observable<PSelectableModel[]> { // Return Observable
        return this.estados$;
    }

    getCatalogo() {
        return this.http.get(`${this.apiUrl}/api/v1/catalogo`);
    }
}
