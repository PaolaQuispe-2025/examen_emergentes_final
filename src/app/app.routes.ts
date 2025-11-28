import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BotellasComponent } from './pages/botellas/botellas.component';
import { MesasComponent } from './pages/mesas/mesas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'botellas', component: BotellasComponent },
  { path: 'mesas', component: MesasComponent },
  { path: '**', redirectTo: '/home' }
];