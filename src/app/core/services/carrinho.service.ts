import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  item: any;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private itens: ItemCarrinho[] = [];
  private carrinhoSubject = new BehaviorSubject<ItemCarrinho[]>([]);

  constructor() { }

  // Retorna os itens do carrinho
  getItens() {
    return this.carrinhoSubject.asObservable();
  }

  // Adiciona um item (se já existir, aumenta a quantidade)
  adicionar(item: any) {
    const existente = this.itens.find(i => 
      (i.item.Iditem || i.item.iditem) === (item.Iditem || item.iditem)
    );

    if (existente) {
      existente.quantidade++;
    } else {
      this.itens.push({ item, quantidade: 1 });
    }
    
    this.carrinhoSubject.next([...this.itens]);
  }

  // Remove um item
  remover(idItem: number) {
    this.itens = this.itens.filter(i => 
      (i.item.Iditem || i.item.iditem) !== idItem
    );
    this.carrinhoSubject.next([...this.itens]);
  }

  // Altera a quantidade de um item
  alterarQuantidade(idItem: number, quantidade: number): void {
    const item = this.itens.find(i => 
      (i.item.Iditem || i.item.iditem) === idItem
    );
    
    if (item) {
      item.quantidade = quantidade;
      if (item.quantidade <= 0) {
        this.remover(idItem);
      } else {
        this.carrinhoSubject.next([...this.itens]);
      }
    }
  }

  // Limpa o carrinho
  limpar() {
    this.itens = [];
    this.carrinhoSubject.next([]);
  }

  // Calcula o total
  getTotal(): number {
    return this.itens.reduce((total, i) => {
      const preco = i.item.Preco !== undefined ? i.item.Preco : (i.item.preco || 0);
      return total + (preco * i.quantidade);
    }, 0);
  }
}