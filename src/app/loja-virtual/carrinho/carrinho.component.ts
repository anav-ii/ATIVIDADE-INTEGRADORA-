import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para o botão "Voltar"
import { CarrinhoService, ItemCarrinho } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  itens: ItemCarrinho[] = [];
  total: number = 0;

  constructor(
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carrinhoService.getItens().subscribe((dados: any) => {
      this.itens = dados;
      this.total = this.carrinhoService.getTotal();
      this.cdr.detectChanges();
    });
  }

  removerItem(idItem: number): void {
    this.carrinhoService.remover(idItem);
  }

  limparCarrinho(): void {
    this.carrinhoService.limpar();
  }

  // Função auxiliar para pegar o nome do item
  getNome(item: any): string {
    return item.Item1 || item.item1 || 'Sem nome';
  }
  
  // Função auxiliar para pegar o preço
  getPreco(item: any): number {
    return item.Preco !== undefined ? item.Preco : (item.preco || 0);
  }
}