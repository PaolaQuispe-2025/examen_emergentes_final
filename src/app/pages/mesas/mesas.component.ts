import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MesaService, Mesa } from '../../services/mesa';
import { BotellaService, Botella } from '../../services/botella';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mesas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.component.html',
  styleUrl: './mesas.component.css'
})
export class MesasComponent implements OnInit, OnDestroy {
  mesas: Mesa[] = [];
  botellasDisponibles: Botella[] = [];
  private mesasSubscription?: Subscription;
  private botellasSubscription?: Subscription;
  
  nuevaMesa: Mesa = {
    numero: '',
    ubicacion: '',
    capacidad: 0,
    botellaId: null
  };

  editingId: number | null = null;

  constructor(
    private mesaService: MesaService,
    private botellaService: BotellaService
  ) {}

  ngOnInit() {
    this.mesasSubscription = this.mesaService.mesas$.subscribe(
      mesas => this.mesas = mesas
    );
    
    this.botellasSubscription = this.botellaService.botellas$.subscribe(
      (      botellas: Botella[]) => this.botellasDisponibles = botellas
    );
  }

  ngOnDestroy() {
    this.mesasSubscription?.unsubscribe();
    this.botellasSubscription?.unsubscribe();
  }

  agregarMesa() {
    if (!this.nuevaMesa.numero || !this.nuevaMesa.ubicacion || this.nuevaMesa.capacidad <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    if (this.editingId) {
      this.mesaService.actualizarMesa({ ...this.nuevaMesa, id: this.editingId });
      this.editingId = null;
    } else {
      this.mesaService.agregarMesa({ ...this.nuevaMesa });
    }

    this.limpiarFormulario();
  }

  editarMesa(mesa: Mesa) {
    this.nuevaMesa = { ...mesa };
    this.editingId = mesa.id!;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarMesa(id: number | undefined) {
    if (id === undefined) return;
    
    if (confirm('¿Estás seguro de eliminar esta mesa?')) {
      this.mesaService.eliminarMesa(id);
    }
  }

  cancelarEdicion() {
    this.limpiarFormulario();
    this.editingId = null;
  }

  limpiarFormulario() {
    this.nuevaMesa = {
      numero: '',
      ubicacion: '',
      capacidad: 0,
      botellaId: null
    };
  }

  getBotellaInfo(botellaId: number | null): string {
    if (!botellaId) return 'Sin botella';
    
    const botella = this.botellaService.getBotellaPorId(botellaId);
    if (botella) {
      return newFunction({ botella });
    }
    return 'Botella no encontrada';
  }

  mesasConBotella(): number {
    return this.mesas.filter(m => m.botellaId !== null).length;
  }

  capacidadTotal(): number {
    return this.mesas.reduce((total, mesa) => total + mesa.capacidad, 0);
  }
}

function newFunction({ botella }: { botella: any; }): string {
  return `${botella.marca} - ${botella.tipo} (${botella.capacidadLitros}L)`;
}
