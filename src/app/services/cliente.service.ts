import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly URL = `${environment.apiUrl}`;  // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.URL}/clientes`);
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL}/clientes/${id}`);
  }

  criarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.URL}/clientes`, cliente);
  }

  atualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.URL}/clientes/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/clientes/${id}`);
  }
}