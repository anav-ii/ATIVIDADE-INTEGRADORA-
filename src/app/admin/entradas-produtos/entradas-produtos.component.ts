import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntradaProdutoService } from '../../core/services/entrada-produto.service';
import { EstoqueService } from '../../core/services/estoque.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-entradas-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './entradas-produtos.component.html',
  styleUrls: ['./entradas-produtos.component.css']
})
export class EntradasProdutosComponent implements OnInit {
  entradas: any[] = [];
  produtos: any[] = [];
  carregando: boolean = true;

  novaEntrada: any = {
    iditem: null,
    dataEntradaProduto: new Date().toISOString().split('T')[0],
    quantidadeEntrada: 1,
    unidade: 'UN',
    valorUnitarioEntrada: 0
  };

  constructor(
    private entradaService: EntradaProdutoService,
    private estoqueService: EstoqueService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.estoqueService.listar().subscribe({
      next: (dados: any) => {
        this.produtos = dados.filter((i: any) => (i.tipoItem || i.TipoItem) === 'P');
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });

    this.entradaService.listar().subscribe({
      next: (dados: any) => {
        this.entradas = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  registrarEntrada(): void {
    if (!this.novaEntrada.iditem || this.novaEntrada.quantidadeEntrada <= 0) {
      alert('Preencha os dados corretamente.');
      return;
    }

    let valorUnitario = this.novaEntrada.valorUnitarioEntrada;
    if (!valorUnitario || valorUnitario <= 0) {
      valorUnitario = 1.00;
    }

    const entradaParaEnviar = {
      Iditem: Number(this.novaEntrada.iditem),
      DataEntradaProduto: this.novaEntrada.dataEntradaProduto,
      QuantidadeEntrada: Number(this.novaEntrada.quantidadeEntrada),
      Unidade: this.novaEntrada.unidade,
      ValorUnitarioEntrada: valorUnitario
    };

    this.entradaService.cadastrar(entradaParaEnviar).subscribe({
      next: () => {
        alert('Entrada registrada e estoque atualizado!');
        this.novaEntrada = {
          iditem: null,
          dataEntradaProduto: new Date().toISOString().split('T')[0],
          quantidadeEntrada: 1,
          unidade: 'UN',
          valorUnitarioEntrada: 0
        };
        this.carregarDados();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao registrar entrada. Verifique o console.');
      }
    });
  }

  getNomeProduto(id: number): string {
    const p = this.produtos.find((x: any) => (x.idItem || x.IdItem) === id);
    return p ? (p.nomeItem || p.NomeItem) : 'Produto ' + id;
  }
  
  getIdEntrada(e: any): number { return e.identradaProduto || e.IdentradaProduto; }
  getData(e: any): string { return e.dataEntradaProduto || e.DataEntradaProduto; }
  getQtd(e: any): number { return e.quantidadeEntrada || e.QuantidadeEntrada; }
  getValor(e: any): number { return e.valorUnitarioEntrada || e.ValorUnitarioEntrada; }
}