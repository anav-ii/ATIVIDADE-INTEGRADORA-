import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AtendimentoService } from '../../core/services/atendimento.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  carregando: boolean = true;

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

  alterarStatus(pedido: any, novoStatus: string): void {
    const idAtendimento = pedido.IdAtendimento || pedido.idAtendimento;
    
    // Monta o objeto para enviar ao C#
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
        // 1. Atualiza o objeto localmente para o Angular já ver a mudança
        pedido.StatusAtendimento = novoStatus;
        pedido.statusAtendimento = novoStatus;

        // 2. Avisa o Angular para redesenhar a tela
        this.cdr.detectChanges(); 
        
        alert(`Pedido #${idAtendimento} alterado para: ${novoStatus}`);
      },
      error: (err: any) => {
        console.error('Erro no backend:', err);
        alert('Erro ao atualizar status.');
      }
    });
  }

  getId(p: any): number { return p.IdAtendimento || p.idAtendimento; }
  getCliente(p: any): string { return p.NomePessoa || p.nomePessoa || 'Cliente Desconhecido'; }
  getData(p: any): string { return p.DataAtendimento || p.dataAtendimento || ''; }
  getStatus(p: any): string { return p.StatusAtendimento || p.statusAtendimento || 'Aberto'; }
}