import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BotellaService, Botella } from '../../services/botella';

@Component({
  selector: 'app-botellas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './botellas.component.html',
  styleUrls: ['./botellas.component.css']
})
export class BotellasComponent implements OnInit {
  botellas: Botella[] = [];
  nuevaBotella: Botella = { marca: '', tipo: '', capacidadLitros: 0, vacia: false };
  editingId: number | null = null;
  cargando = false;

  constructor(private botellaService: BotellaService) {}

  ngOnInit() {
    this.botellaService.botellas$.subscribe(botellas => this.botellas = botellas);
  }

  agregarBotella() {
    if (!this.nuevaBotella.marca || !this.nuevaBotella.tipo || this.nuevaBotella.capacidadLitros <= 0) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    if (this.editingId) {
      this.botellaService.actualizarBotella({ ...this.nuevaBotella, id: this.editingId })
        .subscribe(() => this.limpiarFormulario());
      this.editingId = null;
    } else {
      this.botellaService.agregarBotella({ ...this.nuevaBotella })
        .subscribe(() => this.limpiarFormulario());
    }
  }

  editarBotella(botella: Botella) {
    this.nuevaBotella = { ...botella };
    this.editingId = botella.id!;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  eliminarBotella(id?: number) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar esta botella?')) {
      this.botellaService.eliminarBotella(id).subscribe();
    }
  }

  cancelarEdicion() {
    this.limpiarFormulario();
    this.editingId = null;
  }

  limpiarFormulario() {
    this.nuevaBotella = { marca: '', tipo: '', capacidadLitros: 0, vacia: false };
  }
}
