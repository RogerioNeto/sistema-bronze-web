import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  // URL que criamos no AgendamentoController do IntelliJ
  // Substitua o localhost pelo IP da sua Oracle Cloud
  private readonly URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  enviarReserva(dados: Agendamento): Observable<Agendamento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Agendamento>(`${this.URL}/agendamentos/pre-reserva`, dados, { headers, withCredentials: false });
  }

  getAgendamentos(): Observable<Agendamento[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Agendamento[]>(`${this.URL}/agendamentos`, { headers });
  }

  aprovarAgendamento(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<void>(`${this.URL}/agendamentos/${id}/aprovar`, {}, { headers });
  }
}
