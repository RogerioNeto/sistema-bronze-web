import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly URL = `${environment.apiUrl}`;  // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) { }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.URL);
  }

  getCliente(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/${id}`);
  }

  criarCliente(cliente: any): Observable<any> {
    return this.http.post<any>(this.URL, cliente);
  }

  atualizarCliente(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.URL}/${id}`, cliente);
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${id}`);
  }
}