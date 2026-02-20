import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgendamentoService } from '../../services/agendamento.service';
import { AdminService } from '../../services/admin.service';
import { Agendamento } from '../../models/agendamento';

@Component({
  selector: 'app-pre-reserva',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pre-reserva.html',
  styleUrl: './pre-reserva.scss',
})
export class PreReserva implements OnInit {
  @ViewChild('form') form!: NgForm;
// Objeto que será preenchido pelo formulário
  // Lista de procedimentos carregada do banco
  procedimentos: any[] = [];
  unidades: any[] = [];

  novoAgendamento: Agendamento = {
    nomeCliente: '',
    apelido: '',
    telefone: '',
    dataHora: '',
    procedimento: '',
    status: 'PENDENTE',
    unidade: '',
  };

  constructor(
    private service: AgendamentoService, 
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarUnidades();
    this.carregarProcedimentos();
  }

  carregarUnidades() {
    this.adminService.listar('unidades').subscribe(data => this.unidades = data);
  }

  carregarProcedimentos() {
    this.adminService.listar('procedimentos').subscribe(data => this.procedimentos = data);
  }

  finalizarReserva() {
    this.service.enviarReserva(this.novoAgendamento).subscribe({
      next: (resposta) => {
        // Salva os dados em uma variável local antes de limpar o formulário
        const agendamentoSalvo = { ...this.novoAgendamento };
        this.resetarFormulario();
        
        if (confirm('Reserva realizada com sucesso! \nDeseja abrir o WhatsApp para confirmar e receber o link de pagamento?')) {
          this.enviarMensagemWhatsApp(agendamentoSalvo);
        }
        console.log('Salvo no banco:', resposta);
      },
      error: (erro) => {
        alert('Erro ao enviar reserva. Verifique se o Back-end está rodando!');
        console.error(erro);
      }
    });
  }

  resetarFormulario() {
    const agendamentoLimpo = {
      nomeCliente: '',
      apelido: '',
      telefone: '',
      dataHora: '',
      procedimento: '',
      status: 'PENDENTE',
      unidade: ''
    };

    // Reseta o formulário visualmente (remove erros de validação) e define os valores limpos
    if (this.form) {
      this.form.resetForm(agendamentoLimpo);
    } else {
      this.novoAgendamento = agendamentoLimpo;
    }
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  // Adicione este método dentro da sua classe PreReservaComponent
  formatarTelefone(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

    // Limita a 11 dígitos (DDD + 9 dígitos)
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    // Aplica a máscara (XX) XXXXX-XXXX
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      value = value.replace(/^(\d*)/, '($1');
    }

    input.value = value;
    // Atualize o modelo se necessário, ex: this.agendamento.telefone = value;
  }

  enviarMensagemWhatsApp(agendamento: Agendamento) {
    // 1. Configure aqui o número do WhatsApp da Empresa (com DDD, apenas números)
    const numeroEmpresa = '5511952299297'; 
    
    // 2. Formata a data para ficar legível (ex: 20/02 às 14:00)
    const dataObj = new Date(agendamento.dataHora);
    const dataFormatada = dataObj.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    
    // 3. Monta a mensagem automática
    const texto = `Olá! Me chamo *${agendamento.nomeCliente}*.` +
      `\nAcabei de solicitar um agendamento para *${dataFormatada}*.` +
      `\nProcedimento: *${agendamento.procedimento}*.` +
      `\n\nGostaria de confirmar e receber o link para pagamento do sinal.`;

    // 4. Cria o link e abre em nova aba
    const url = `https://wa.me/${numeroEmpresa}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  }
}
