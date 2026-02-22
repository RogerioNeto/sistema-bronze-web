import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../models/login-response';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly URL = `${environment.apiUrl}`;// Endpoint que criaremos no Java

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    return this.http.post<LoginResponse>(`${this.URL}/login`, credentials, { headers }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
      })
    );
  }
}
