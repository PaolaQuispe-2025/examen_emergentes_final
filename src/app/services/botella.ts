import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface Botella {
  id?: number;
  marca: string;
  tipo: string;
  capacidadLitros: number;
  vacia: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BotellaService {
  private botellasSubject = new BehaviorSubject<Botella[]>([]);
  public botellas$ = this.botellasSubject.asObservable();
  private nextId = 1;

  // Si tienes un backend real, coloca la URL aquí
  private apiUrl = 'http://localhost:8080/botellas';

  constructor(private http?: HttpClient) {
    this.cargarDatosLocal();
  }

  // --- LOCAL STORAGE (fallback o principal) ---
  private cargarDatosLocal() {
    const datosGuardados = localStorage.getItem('botellas');
    if (datosGuardados) {
      const botellas = JSON.parse(datosGuardados);
      this.botellasSubject.next(botellas);
      if (botellas.length > 0) {
        this.nextId = Math.max(...botellas.map((b: { id: any; }) => b.id || 0)) + 1;
      }
    }
  }

  private guardarDatosLocal() {
    localStorage.setItem('botellas', JSON.stringify(this.botellasSubject.value));
  }

  // --- MÉTODOS PRINCIPALES ---
  getBotellas(): Observable<Botella[]> {
    // Si quieres usar backend, descomenta esta línea:
    // return this.http!.get<Botella[]>(this.apiUrl).pipe(tap(botellas => this.botellasSubject.next(botellas)));
    
    // LocalStorage / BehaviorSubject
    return of(this.botellasSubject.value);
  }

  agregarBotella(botella: Botella): Observable<Botella> {
    // Backend real:
    // return this.http!.post<Botella>(this.apiUrl, botella).pipe(tap(() => this.cargarDatosLocal()));

    // LocalStorage:
    botella.id = this.nextId++;
    const botellas = this.botellasSubject.value;
    botellas.push(botella);
    this.botellasSubject.next(botellas);
    this.guardarDatosLocal();
    return of(botella);
  }

  actualizarBotella(botella: Botella): Observable<Botella> {
    // Backend real:
    // return this.http!.put<Botella>(`${this.apiUrl}/${botella.id}`, botella).pipe(tap(() => this.cargarDatosLocal()));

    // LocalStorage:
    const botellas = this.botellasSubject.value;
    const index = botellas.findIndex(b => b.id === botella.id);
    if (index !== -1) {
      botellas[index] = botella;
      this.botellasSubject.next(botellas);
      this.guardarDatosLocal();
    }
    return of(botella);
  }

  eliminarBotella(id: number): Observable<any> {
    // Backend real:
    // return this.http!.delete(`${this.apiUrl}/${id}`).pipe(tap(() => this.cargarDatosLocal()));

    // LocalStorage:
    const botellas = this.botellasSubject.value.filter(b => b.id !== id);
    this.botellasSubject.next(botellas);
    this.guardarDatosLocal();
    return of({ ok: true });
  }

  getBotellaPorId(id: number): Botella | undefined {
    return this.botellasSubject.value.find(b => b.id === id);
  }
}

