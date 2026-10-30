import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AtendimentoService } from '../../core/services/atendimento.service';

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './meus-pedidos.component.html',
  styleUrls: ['./meus-pedidos.component.css']
})
export class MeusPedidosComponent implements OnInit {
  pedidos: any[] = [];
  carregando: boolean = true;
  idCliente: number | null = null;

  constructor(
    private atendimentoService: AtendimentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Pega o ID do cliente que foi salvo no cadastro
    const idSalvo = localStorage.getItem('idCliente');
    this.idCliente = idSalvo ? Number(idSalvo) : null;

    if (this.idCliente) {
      this.carregarPedidos();
    } else {
      this.carregando = false;
    }
  }

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

  // Funções auxiliares
  getId(p: any): number { return p.idAtendimento || p.IdAtendimento; }
  getData(p: any): string { return p.dataAtendimento || p.DataAtendimento || ''; }
  getStatus(p: any): string { return p.statusAtendimento || p.StatusAtendimento || 'Aberto'; }
  
  getTotal(p: any): number {
    const itens = p.itens || p.Itens || [];
    return itens.reduce((total: number, item: any) => {
      return total + ((item.valorUnitario || item.ValorUnitario || 0) * (item.quantidade || item.Quantidade || 0));
    }, 0);
  }
}