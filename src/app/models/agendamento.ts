export interface Agendamento {
  id?: number;
  nomeCliente: string;
  apelido?: string;
  telefone: string;
  dataHora: string;
  procedimento: string;
  unidade?: string;
  status?: string; // O '?' indica que é opcional
}
