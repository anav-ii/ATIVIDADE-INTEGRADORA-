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

  getItens() {
    return this.carrinhoSubject.asObservable();
  }

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

  remover(idItem: number) {
    this.itens = this.itens.filter(i => 
      (i.item.Iditem || i.item.iditem) !== idItem
    );
    this.carrinhoSubject.next([...this.itens]);
  }

  limpar() {
    this.itens = [];
    this.carrinhoSubject.next([]);
  }

  getTotal(): number {
    return this.itens.reduce((total, i) => {
      const preco = i.item.Preco !== undefined ? i.item.Preco : (i.item.preco || 0);
      return total + (preco * i.quantidade);
    }, 0);
  }
}