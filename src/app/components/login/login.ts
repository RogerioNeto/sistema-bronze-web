import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  credenciais = {
    usuario: '',
    senha: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  fazerLogin() {
    this.authService.login(this.credenciais).subscribe({
      next: (response: any) => {
        console.log('Login realizado:', response);
        // Aqui você pode salvar o token no localStorage, por exemplo
        localStorage.setItem('token', response.token);
        this.router.navigate(['/admin']); 
      },
      error: (err) => {
        alert('Acesso negado! Verifique suas credenciais.');
        console.error(err);
      }
    });
  }
}