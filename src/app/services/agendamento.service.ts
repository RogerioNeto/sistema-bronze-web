import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  // URL que criamos no AgendamentoController do IntelliJ
  private apiUrl = 'http://localhost:8090/api/agendamentos';

  constructor(private http: HttpClient) { }

  enviarReserva(dados: Agendamento): Observable<Agendamento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Agendamento>(`${this.apiUrl}/pre-reserva`, dados, { headers, withCredentials: false });
  }

  getAgendamentos(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.apiUrl);
  }

  aprovarAgendamento(id: number): Observable<void> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<void>(`${this.apiUrl}/${id}/aprovar`, {}, { headers });
  }
}
