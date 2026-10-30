import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstoqueService } from '../../core/services/estoque.service';
import { RouterLink } from '@angular/router'; // Adicione


@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent implements OnInit {
  itens: any[] = [];
  carregando: boolean = true;

  constructor(
    private estoqueService: EstoqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarEstoque();
  }

  carregarEstoque(): void {
    this.estoqueService.listar().subscribe({
      next: (dados: any) => {
        this.itens = dados;
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

  // Funções auxiliares (apenas leitura)
  getNome(item: any): string { return item.nomeItem || item.NomeItem || 'Sem nome'; }
  getPreco(item: any): number { return item.precoVenda || item.PrecoVenda || 0; }
  getQuantidade(item: any): number { return item.quantidadeEstoque || item.QuantidadeEstoque || 0; }
  getCategoria(item: any): string { return item.categoria || item.Categoria || 'Sem categoria'; }
  
  getTipo(item: any): string {
    const tipo = (item.tipoItem || item.TipoItem || '').toUpperCase();
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }
}