// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o select de filtro
import { RouterLink } from '@angular/router'; // Necessário para o botão de voltar
// Importa o serviço que busca os pedidos no banco
import { AtendimentoService } from '../../core/services/atendimento.service';

// Configuração do Componente
@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  // Lista que vai receber os pedidos do banco
  pedidos: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;
  
  // Variável ligada ao filtro de status (começa com 'Todos')
  filtroStatus: string = 'Todos'; 

  // Injeção de dependências (Serviço e ChangeDetectorRef)
  constructor(
    private atendimentoService: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarPedidos();
  }

  // Busca todos os pedidos no banco
  carregarPedidos(): void {
    this.atendimentoService.listar().subscribe({
      next: (dados: any) => {
        this.pedidos = dados; // Salva os dados na lista
        this.carregando = false; // Para de mostrar "Carregando"
        this.cdr.detectChanges(); // Força o Angular a atualizar a tela
      },
      error: (err: any) => {
        console.error(err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Função que FILTRA os pedidos com base no select
  getPedidosFiltrados(): any[] {
    // Se o filtro for 'Todos', retorna a lista completa
    if (this.filtroStatus === 'Todos') {
      return this.pedidos;
    }
    // Se não, filtra apenas os pedidos com o status selecionado
    return this.pedidos.filter(p => this.getStatus(p) === this.filtroStatus);
  }

  // Função chamada quando o admin muda o status de um pedido no select
  alterarStatus(pedido: any, novoStatus: string): void {
    const idAtendimento = pedido.IdAtendimento || pedido.idAtendimento;
    
    // Monta o objeto com os dados atualizados (formato que o C# espera)
    const pedidoAtualizado = {
      IdAtendimento: idAtendimento,
      IdPessoa: pedido.IdPessoa || pedido.idPessoa,
      DataAtendimento: pedido.DataAtendimento || pedido.dataAtendimento,
      StatusAtendimento: novoStatus, // O novo status selecionado
      Itens: (pedido.Itens || pedido.itens || []).map((i: any) => ({
        IdAtendimento: idAtendimento,
        IdItem: i.IdItem || i.idItem,
        IdFuncionario: i.IdFuncionario || i.idFuncionario,
        Quantidade: i.Quantidade || i.quantidade,
        ValorUnitario: i.ValorUnitario || i.valorUnitario
      }))
    };

    // Envia para o backend (C#)
    this.atendimentoService.atualizar(idAtendimento, pedidoAtualizado).subscribe({
      next: () => {
        alert(`Pedido #${idAtendimento} alterado para: ${novoStatus}`);
        // Atualiza o status localmente para a tela refletir na hora
        pedido.StatusAtendimento = novoStatus;
        pedido.statusAtendimento = novoStatus;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro no backend:', err);
        alert('Erro ao atualizar status.');
      }
    });
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  getId(p: any): number { return p.IdAtendimento || p.idAtendimento; }
  getCliente(p: any): string { return p.NomePessoa || p.nomePessoa || 'Cliente Desconhecido'; }
  getData(p: any): string { return p.DataAtendimento || p.dataAtendimento || ''; }
  getStatus(p: any): string { return p.StatusAtendimento || p.statusAtendimento || 'Aberto'; }
}