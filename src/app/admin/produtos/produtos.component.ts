import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../core/services/item.service';

@Component({
  selector: 'app-produtos-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  itens: any[] = [];
  carregando: boolean = true;

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarItens();
  }

  carregarItens(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        // FILTRA APENAS PRODUTOS ('P')
        this.itens = dados.filter((i: any) => {
          const tipo = (i.TipoItem || i.tipoItem || '').toUpperCase();
          return tipo === 'P';
        });
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

  alternarStatus(item: any): void {
    const statusAtual = item.AtivoProdutoServico || item.ativoProdutoServico;
    const novoStatus = (statusAtual === 'S' || statusAtual === 'ativo') ? 'N' : 'S';
    
    const itemAtualizado = {
      ...item,
      AtivoProdutoServico: novoStatus,
      ativoProdutoServico: novoStatus
    };

    const id = item.Iditem || item.iditem;

    this.itemService.atualizar(id, itemAtualizado).subscribe({
      next: () => {
        alert('Status alterado com sucesso!');
        this.carregarItens();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao alterar status.');
      }
    });
  }

  getNome(item: any): string { return item.Item1 || item.item1 || 'Sem nome'; }
  getPreco(item: any): number { return item.Preco !== undefined ? item.Preco : (item.preco || 0); }
  getAtivo(item: any): string { return item.AtivoProdutoServico || item.ativoProdutoServico || 'N'; }
  getId(item: any): number { return item.Iditem || item.iditem; }
}