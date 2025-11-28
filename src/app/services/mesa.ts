import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Mesa {
  id?: number;
  numero: string;
  ubicacion: string;
  capacidad: number;
  botellaId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private mesasSubject = new BehaviorSubject<Mesa[]>([]);
  public mesas$: Observable<Mesa[]> = this.mesasSubject.asObservable();
  private nextId = 1;

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos() {
    const datosGuardados = localStorage.getItem('mesas');
    if (datosGuardados) {
      const mesas = JSON.parse(datosGuardados);
      this.mesasSubject.next(mesas);
      if (mesas.length > 0) {
        this.nextId = Math.max(...mesas.map((m: Mesa) => m.id || 0)) + 1;
      }
    }
  }

  private guardarDatos() {
    localStorage.setItem('mesas', JSON.stringify(this.mesasSubject.value));
  }

  getMesas(): Mesa[] {
    return this.mesasSubject.value;
  }

  agregarMesa(mesa: Mesa): void {
    const mesas = this.mesasSubject.value;
    mesa.id = this.nextId++;
    mesas.push(mesa);
    this.mesasSubject.next(mesas);
    this.guardarDatos();
  }

  actualizarMesa(mesa: Mesa): void {
    const mesas = this.mesasSubject.value;
    const index = mesas.findIndex(m => m.id === mesa.id);
    if (index !== -1) {
      mesas[index] = mesa;
      this.mesasSubject.next(mesas);
      this.guardarDatos();
    }
  }

  eliminarMesa(id: number): void {
    const mesas = this.mesasSubject.value.filter(m => m.id !== id);
    this.mesasSubject.next(mesas);
    this.guardarDatos();
  }
}