import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Ajuste a URL conforme a porta do seu back-end
  private readonly URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // Lista todos os registros de uma entidade (ex: 'unidades', 'produtos')
 listar(endpoint: string): Observable<any[]> {
    const url = `${this.URL}/${endpoint}`;
    console.log('Chamando API:', url); // Adiciona este log
   
    return this.http.get<any[]>(url).pipe(
      tap(data => console.log('API Response:', data)), // Log da resposta
      catchError(error => {
        console.error('API Error:', error); // Log de erro
        // Propaga o erro para quem chamou o método
        throw error;
      })
    );
  }

  // Busca um registro específico pelo ID para edição
  buscar(endpoint: string, id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/${endpoint}/${id}`);
  }

  // Salva (POST) ou Atualiza (PUT) dependendo se tem ID
  salvar(endpoint: string, dados: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (dados.id) {
      return this.http.put<any>(`${this.URL}/${endpoint}/${dados.id}`, dados, { headers });
    } else {
      return this.http.post<any>(`${this.URL}/${endpoint}`, dados, { headers });
    }
  }

  // Exclui um registro
  excluir(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${endpoint}/${id}`);
  }
}
