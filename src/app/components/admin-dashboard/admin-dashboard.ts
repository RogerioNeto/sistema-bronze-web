import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgendamentoService } from '../../services/agendamento.service';
import { ClienteService } from '../../services/cliente.service';
import { AdminService } from '../../services/admin.service';
import { Agendamento } from '../../models/agendamento';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  currentView: string = 'agendamentos'; // Controla qual tela está visível
  showModal: boolean = false; // Controla a visibilidade do modal
  formType: string = ''; // Define qual formulário exibir (Unidade, Produto, etc.)
  formData: any = {}; // Armazena os dados do formulário
  clientes: any[] = [];
  agendamentos: Agendamento[] = [];
  menuAberto: boolean = false; // Controle do menu mobile
  
  // Variáveis Financeiras
  totalEntradas: number = 0;
  totalSaidas: number = 0;
  totalContas: number = 0;
  totalCompras: number = 0;
  saldo: number = 0;

  // Variáveis para Comanda
  comandas: any[] = [];
  itensComanda: any[] = [];
  agendamentosAprovados: Agendamento[] = [];
  itemParaAdicionar: any = { tipo: 'PRODUTO', id: null, quantidade: 1 };
  formasPagamento = ['Dinheiro', 'PIX', 'Cartão de Crédito', 'Cartão de Débito'];
  
  // Listas vazias, serão preenchidas pelo backend
  unidades: any[] = [];
  usuarios: any[] = [];
  produtos: any[] = [];
  procedimentos: any[] = [];
  contas: any[] = [];
  compras: any[] = [];

  menuItems = [
    { label: 'Financeiro', view: 'financeiro' },
    { label: 'Comandas', view: 'comandas' },
    { label: 'Clientes', view: 'clientes' },
    { label: 'Painel Agendamentos', view: 'agendamentos' }, // Novo item para voltar
    { label: 'Unidades', view: 'unidades' },
    { label: 'Usuários', view: 'usuarios' },
    { label: 'Produtos', view: 'produtos' },
    { label: 'Procedimentos', view: 'procedimentos' },
    { label: 'Contas', view: 'contas' },
    { label: 'Compras', view: 'compras' }
  ];

  constructor(
    private agendamentoService: AgendamentoService, 
    private clienteService: ClienteService,
    private adminService: AdminService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarAgendamentos();
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  carregarAgendamentos() {
    this.agendamentoService.getAgendamentos().subscribe({
      next: (data) => {
        console.log('Agendamentos carregados:', data);
        this.agendamentos = data;
        this.cdr.detectChanges(); // Força a atualização da tela
        if (this.agendamentos.length === 0) setTimeout(() => alert('Nenhum agendamento encontrado.'), 100);
      },
      error: (err) => console.error('Erro ao carregar agendamentos', err)
    });
  }

  selecionarVista(viewName: string) {
    this.currentView = viewName;

    if (viewName === 'financeiro') {
      this.carregarFinanceiro();
    } else if (viewName !== 'agendamentos') {
      this.carregarDados(viewName);
    } else {
      this.carregarAgendamentos();
    }
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe({
       next: (data) => {
        this.clientes = data;
      },
      error: (err) => console.error('Erro ao carregar clientes', err)
    });
  }

  carregarFinanceiro() {
    forkJoin({
      comandas: this.adminService.listar('comandas'),
      contas: this.adminService.listar('contas'),
      compras: this.adminService.listar('compras')
    }).subscribe({
      next: (result: any) => {
        const comandasFechadas = result.comandas.filter((c: any) => c.fechada);
        this.totalEntradas = comandasFechadas.reduce((acc: number, curr: any) => acc + (curr.valorTotal || 0), 0);
        
        this.totalContas = result.contas.reduce((acc: number, curr: any) => acc + (curr.valor || 0), 0);
        this.totalCompras = result.compras.reduce((acc: number, curr: any) => acc + (curr.valor || 0), 0);
        this.totalSaidas = this.totalContas + this.totalCompras;
        
        this.saldo = this.totalEntradas - this.totalSaidas;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao carregar financeiro', err)
    });
  }

  carregarDados(view: string) {
    this.adminService.listar(view).subscribe({
      next: (data) => {
        if (view === 'unidades') this.unidades = data;
        else if (view === 'usuarios') this.usuarios = data;
        else if (view === 'clientes') this.clientes = data;
        else if (view === 'produtos') this.produtos = data;
        else if (view === 'procedimentos') this.procedimentos = data;
        else if (view === 'contas') this.contas = data;
        else if (view === 'compras') this.compras = data;
        else if (view === 'comandas') this.comandas = data;
        this.cdr.detectChanges(); // Força a atualização da tela
      },
      error: (err) => console.error('Erro ao carregar ' + view, err)
    });
  }

  abrirFormulario(tipo: string, item?: any) {
    this.formType = tipo;
    this.showModal = true; // Abre o modal imediatamente
    
    if (tipo === 'Agendamento') {
      this.carregarClientes();
      this.carregarDados('procedimentos');
      this.carregarDados('unidades');
    }
    
    if (tipo === 'Comanda') {
      this.carregarDados('produtos');
      this.carregarDados('procedimentos');
      this.agendamentoService.getAgendamentos().subscribe(data => {
        this.agendamentosAprovados = data.filter(a => a.status === 'APROVADO');
        this.cdr.detectChanges(); // Garante atualização da lista no combo
      });
      this.itensComanda = [];
    }

    if (item && item.id) {
      // EDICÃO: Usa os dados da lista imediatamente
      this.formData = { ...item };
      
      // Busca dados atualizados do backend em segundo plano
      const endpoint = this.mapTipoParaEndpoint(tipo);
      if (endpoint) {
        this.adminService.buscar(endpoint, item.id).subscribe({
          next: (dados) =>{
            this.formData = dados;
            if (this.formType === 'Comanda') {
              this.itensComanda = dados.itens || [];
            }
            // Garante que o ID seja preservado caso o backend não o retorne no corpo da resposta
            if (!this.formData.id) this.formData.id = item.id;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Erro ao buscar dados', err);
          }
        });
      }
    } else {
      // NOVO CADASTRO: Inicializa com campos vazios para garantir o binding
      this.inicializarFormulario(tipo);
    }
  }

  inicializarFormulario(tipo: string) {
    switch (tipo) {
      case 'Agendamento':
        this.formData = { nomeCliente: '', apelido: '', telefone: '', dataHora: '', procedimento: '', status: 'PENDENTE', unidadeId: null };
        break;
      case 'Cliente':
        this.formData = { nome: '', email: '', telefone: '', apelido: '', observacao: '' };
        break;
      case 'Unidade':
        this.formData = { nome: '', endereco: '', telefone: '' };
        break;
      case 'Usuário':
        this.formData = { nome: '', email: '', senha: '', role: '', unidade_id: null };
        break;
      case 'Produto':
        this.formData = { nome: '', preco: 0, quantidadeEstoque: 0 };
        break;
      case 'Procedimento':
        this.formData = { nome: '', duracao: '', valor: 0 };
        break;
      case 'Conta':
        this.formData = { descricao: '', valor: 0, dataVencimento: '' };
        break;
      case 'Compra':
        this.formData = { descricao: '', valor: 0, dataCompra: '', fornecedor: '' };
        break;
      case 'Comanda':
        this.formData = { agendamentoId: null, clienteNome: '', data: '', valorTotal: 0, itens: [], fechada: false, formaPagamento: null };
        break;
      // Adicione outros casos conforme necessário
      default:
        this.formData = {};
        break;
    }
  }

  // --- Lógica da Comanda ---

  onAgendamentoChange() {
    const agendamento = this.agendamentosAprovados.find(a => a.id == this.formData.agendamentoId);
    if (agendamento) {
      this.formData.clienteNome = agendamento.nomeCliente || agendamento.apelido;
      this.formData.data = agendamento.dataHora;
      
      // Adiciona o procedimento do agendamento como primeiro item
      this.itensComanda = [];
      const proc = this.procedimentos.find(p => p.nome === agendamento.procedimento);
      const valor = proc ? proc.valor : 0;
      
      this.itensComanda.push({
        nome: agendamento.procedimento,
        tipo: 'PROCEDIMENTO',
        valorUnitario: valor,
        quantidade: 1,
        total: valor
      });
      this.calcularTotalComanda();
    }
  }

  adicionarItemComanda() {
    if (!this.itemParaAdicionar.id) return;

    let itemEncontrado;
    if (this.itemParaAdicionar.tipo === 'PRODUTO') {
      itemEncontrado = this.produtos.find(p => p.id == this.itemParaAdicionar.id);
    } else {
      itemEncontrado = this.procedimentos.find(p => p.id == this.itemParaAdicionar.id);
    }

    if (itemEncontrado) {
      const valor = this.itemParaAdicionar.tipo === 'PRODUTO' ? itemEncontrado.preco : itemEncontrado.valor;
      this.itensComanda.push({
        nome: itemEncontrado.nome,
        tipo: this.itemParaAdicionar.tipo,
        valorUnitario: valor,
        quantidade: this.itemParaAdicionar.quantidade,
        total: valor * this.itemParaAdicionar.quantidade
      });
      this.calcularTotalComanda();
      this.itemParaAdicionar.id = null; // Resetar seleção
    }
  }

  removerItemComanda(index: number) {
    this.itensComanda.splice(index, 1);
    this.calcularTotalComanda();
  }

  calcularTotalComanda() {
    this.formData.valorTotal = this.itensComanda.reduce((acc, item) => acc + item.total, 0);
  }

  fecharFormulario() {
    this.showModal = false;
    this.formData = {};
  }

  fecharComanda() {
    if (!this.formData.formaPagamento) {
      alert('Por favor, selecione a forma de pagamento para fechar a comanda.');
      return;
    }
    this.formData.fechada = true;
    this.salvarFormulario();
  }

  salvarFormulario() {
    const endpoint = this.mapTipoParaEndpoint(this.formType);

    if (this.formType === 'Comanda') {
      this.formData.itens = this.itensComanda;
    }

    console.log('Enviando dados para o backend:', this.formData); // Log para conferência

    this.adminService.salvar(endpoint, this.formData).subscribe({
      next: () => {
        this.fecharFormulario();
        this.carregarDados(endpoint); // Recarrega a lista
        setTimeout(() => alert('Registro salvo com sucesso!'), 100); // Aguarda a UI atualizar antes de travar com o alert
      },
      error: (err) => alert('Erro ao salvar: ' + (err.error?.message || 'Erro desconhecido'))
    });
  }


  aprovar(agendamento: Agendamento) {
    if (!agendamento.id) return;
    
    if (confirm(`Deseja aprovar o agendamento de ${agendamento.nomeCliente}?`)) {
      this.agendamentoService.aprovarAgendamento(agendamento.id).subscribe({
        next: () => {
          this.carregarAgendamentos();
          setTimeout(() => alert('Agendamento aprovado com sucesso!'), 100);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao aprovar agendamento. Verifique se você tem permissão.');
        }
      });
    }
  }


  excluir(tipo: string, id: number) {
    if (confirm('Deseja realmente excluir este registro?')) {
      const endpoint = this.mapTipoParaEndpoint(tipo);
      if (endpoint) {
        this.adminService.excluir(endpoint, id).subscribe(() => {
          this.carregarDados(endpoint);
        });
      }
    }
  }

  private mapTipoParaEndpoint(tipo: string): string {
    switch (tipo) {
      case 'Unidade': return 'unidades';
      case 'Cliente': return 'clientes';
      case 'Usuário': return 'usuarios';
      case 'Produto': return 'produtos';
      case 'Procedimento': return 'procedimentos';
      case 'Conta': return 'contas';
      case 'Compra': return 'compras';
      case 'Agendamento': return 'agendamentos';
      case 'Comanda': return 'comandas';
      default: return '';
    }
  }

  // Métodos auxiliares para o template HTML
  getTituloAtual(): string {
    const item = this.menuItems.find(i => i.view === this.currentView);
    return item ? item.label : 'Painel Administrativo';
  }

  getFormType(): string {
    // Retorna o nome do tipo baseado na view atual (ex: 'unidades' -> 'Unidade')
    const map: {[key: string]: string} = {
      'unidades': 'Unidade', 'usuarios': 'Usuário', 'clientes': 'Cliente',
      'produtos': 'Produto', 'procedimentos': 'Procedimento', 'contas': 'Conta',
      'compras': 'Compra', 'agendamentos': 'Agendamento'
    };
    return map[this.currentView] || 'Registro';
  }

  getListaAtual(): any[] {
    if (this.currentView === 'agendamentos') return this.agendamentos;
    if (this.currentView === 'unidades') return this.unidades;
    if (this.currentView === 'usuarios') return this.usuarios;
    if (this.currentView === 'clientes') return this.clientes;
    // ... adicione outros conforme necessário
    return [];
  }

  getFormKeys(): string[] {
    // Retorna as chaves do objeto formData para gerar campos dinamicamente no modal (simplificado)
    // Na prática, você pode querer definir campos específicos para cada tipo
    return Object.keys(this.formData).filter(k => k !== 'id' && k !== 'itens');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
