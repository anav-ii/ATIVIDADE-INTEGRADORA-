// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Necessário para os links de navegação
// Importa o serviço que busca os pedidos no banco
import { AtendimentoService } from '../../core/services/atendimento.service';

// Configuração do Componente
@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.css']
})
export class MeusPedidosComponent implements OnInit {
  // Lista que vai receber os pedidos do cliente
  pedidos: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;
  // Armazena o ID do cliente logado (pego do localStorage)
  idCliente: number | null = null;

  // Injeção de dependências
  constructor(
    private atendimentoService: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    // Pega o ID do cliente que foi salvo no cadastro (localStorage)
    const idSalvo = localStorage.getItem('idCliente');
    this.idCliente = idSalvo ? Number(idSalvo) : null;

    // Se o cliente estiver logado, busca os pedidos
    if (this.idCliente) {
      this.carregarPedidos();
    } else {
      this.carregando = false; // Se não estiver logado, para de carregar
    }
  }

  // Busca todos os pedidos no banco e FILTRA apenas os do cliente logado
  carregarPedidos(): void {
    this.atendimentoService.listar().subscribe({
      next: (dados: any) => {
        // Filtra os pedidos apenas do cliente logado
        this.pedidos = dados.filter((p: any) => 
          (p.idPessoa || p.IdPessoa) === this.idCliente
        );
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  
  // Pega o ID do pedido
  getId(p: any): number { return p.idAtendimento || p.IdAtendimento; }
  
  // Pega a data do pedido
  getData(p: any): string { return p.dataAtendimento || p.DataAtendimento || ''; }
  
  // Pega o status do pedido
  getStatus(p: any): string { return p.statusAtendimento || p.StatusAtendimento || 'Aberto'; }
  
  // Calcula o valor total do pedido (soma dos itens)
  getTotal(p: any): number {
    const itens = p.itens || p.Itens || [];
    return itens.reduce((total: number, item: any) => {
      return total + ((item.valorUnitario || item.ValorUnitario || 0) * (item.quantidade || item.Quantidade || 0));
    }, 0);
  }
}