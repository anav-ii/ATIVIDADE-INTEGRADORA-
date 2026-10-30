import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Importante para o botão de voltar
import { AtendimentoService } from '../../core/services/atendimento.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Adicionado RouterLink
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  carregando: boolean = true;
  
  // Variável do filtro de status
  filtroStatus: string = 'Todos'; 

  constructor(
    private atendimentoService: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.atendimentoService.listar().subscribe({
      next: (dados: any) => {
        this.pedidos = dados;
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

  // Função que filtra os pedidos com base na seleção
  getPedidosFiltrados(): any[] {
    if (this.filtroStatus === 'Todos') {
      return this.pedidos;
    }
    return this.pedidos.filter(p => this.getStatus(p) === this.filtroStatus);
  }

  alterarStatus(pedido: any, novoStatus: string): void {
    const idAtendimento = pedido.IdAtendimento || pedido.idAtendimento;
    
    const pedidoAtualizado = {
      IdAtendimento: idAtendimento,
      IdPessoa: pedido.IdPessoa || pedido.idPessoa,
      DataAtendimento: pedido.DataAtendimento || pedido.dataAtendimento,
      StatusAtendimento: novoStatus,
      Itens: (pedido.Itens || pedido.itens || []).map((i: any) => ({
        IdAtendimento: idAtendimento,
        IdItem: i.IdItem || i.idItem,
        IdFuncionario: i.IdFuncionario || i.idFuncionario,
        Quantidade: i.Quantidade || i.quantidade,
        ValorUnitario: i.ValorUnitario || i.valorUnitario
      }))
    };

    this.atendimentoService.atualizar(idAtendimento, pedidoAtualizado).subscribe({
      next: () => {
        alert(`Pedido #${idAtendimento} alterado para: ${novoStatus}`);
        pedido.StatusAtendimento = novoStatus; // Atualiza localmente
        pedido.statusAtendimento = novoStatus;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro no backend:', err);
        alert('Erro ao atualizar status.');
      }
    });
  }

  // Funções auxiliares
  getId(p: any): number { return p.IdAtendimento || p.idAtendimento; }
  getCliente(p: any): string { return p.NomePessoa || p.nomePessoa || 'Cliente Desconhecido'; }
  getData(p: any): string { return p.DataAtendimento || p.dataAtendimento || ''; }
  getStatus(p: any): string { return p.StatusAtendimento || p.statusAtendimento || 'Aberto'; }
}