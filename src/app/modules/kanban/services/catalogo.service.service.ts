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
    private readonly estadosSubject = new BehaviorSubject<PSelectableModel[]>([]);
    private readonly prioridadSubject = new BehaviorSubject<PSelectableModel[]>([]);
    public estados$ = this.estadosSubject.asObservable();
    public prioridades$ = this.prioridadSubject.asObservable();
    private estadosCache: PSelectableModel[] | null = null; // Cache
    private prioridadesCache: PSelectableModel[] | null = null; // Cache

    constructor(private readonly http: HttpClient) {
        this.loadEstados();
        this.loadPrioridades();
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

    loadPrioridades() {
        if (this.prioridadesCache) {
            this.prioridadSubject.next(this.prioridadesCache); // If cached, emit immediately
        } else {
            this.http.get<PSelectableModel[]>(`${this.apiUrl}/api/v1/catalogo/prioridades`).pipe(
                tap(prioridades => {
                    this.prioridadesCache = prioridades;
                    this.prioridadSubject.next(prioridades);
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

    getPrioridades(): Observable<PSelectableModel[]> { // Return Observable
        return this.prioridades$;
    }

    getCatalogo() {
        return this.http.get(`${this.apiUrl}/api/v1/catalogo`);
    }
}
