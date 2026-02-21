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
    return this.http.post<Agendamento>(`${this.URL}/pre-reserva`, dados, { headers, withCredentials: false });
  }

  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.URL);
  }

  aprovarAgendamento(id: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.URL}/${id}/aprovar`, {}, { headers });
  }
}
