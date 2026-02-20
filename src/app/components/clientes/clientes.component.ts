import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  novoCliente: any = {};
  editandoCliente: any = null;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes,
      error => console.error('Erro ao carregar clientes:', error)
    );
  }

  adicionarCliente(): void {
    this.clienteService.criarCliente(this.novoCliente).subscribe(
      () => {
        this.novoCliente = {};
        this.carregarClientes();
      },
      error => console.error('Erro ao adicionar cliente:', error)
    );
  }

  editarCliente(cliente: any): void {
    this.editandoCliente = { ...cliente };
  }

  salvarCliente(): void {
    this.clienteService.atualizarCliente(this.editandoCliente.id, this.editandoCliente).subscribe(
      () => {
        this.editandoCliente = null;
        this.carregarClientes();
      },
      error => console.error('Erro ao salvar cliente:', error)
    );
  }

  excluirCliente(id: number): void {
    this.clienteService.excluirCliente(id).subscribe(
      () => this.carregarClientes(),
      error => console.error('Erro ao excluir cliente:', error)
    );
  }

  cancelarEdicao(): void {
    this.editandoCliente = null;
  }

  estaEditando(cliente: any): boolean {
    return this.editandoCliente && this.editandoCliente.id === cliente.id;
  }
}