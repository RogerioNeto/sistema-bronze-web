import { Routes } from '@angular/router';
import { PreReserva } from './components/pre-reserva/pre-reserva';
import { Login } from './components/login/login';
import { DashboardResponsavel } from './components/dashboard-responsavel/dashboard-responsavel';
import { ClientesComponent } from './components/clientes/clientes.component';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/reserva', pathMatch: 'full' }, // Rota padrão (Cliente)
  { path: 'reserva', component: PreReserva },    // Área da Cliente
  { path: 'login', component: Login },            // Login Admin/Resp
  { path: 'clientes', component: ClientesComponent },  // tela de clientes
    { path: 'dashboard', component: DashboardResponsavel }, // Área Interna (Legado/Responsável)
  { path: 'admin', component: AdminDashboard }    // Nova Área Administrativa
];
