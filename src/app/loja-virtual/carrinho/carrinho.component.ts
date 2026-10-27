import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para o botão "Voltar"
import { CarrinhoService, ItemCarrinho } from '../../core/services/carrinho.service';
import { Router } from '@angular/router';
import { AtendimentoService } from '../../core/services/atendimento.service';


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
    private atendimentoService: AtendimentoService, // <-- Adicione
    private router: Router,                         // <-- Adicione
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

  finalizarPedido(): void {
    // Pega os itens atuais do carrinho
    let itensCarrinho: any[] = [];
    this.carrinhoService.getItens().subscribe((dados: any) => {
      itensCarrinho = dados;
    });

    if (itensCarrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Monta o objeto exatamente como o seu C# espera (AtendimentoPostDTO)
    const pedido = {
      IdAtendimento: 0,
      IdPessoa: 3, // Usando ID 1 de teste (ideal seria pegar o cliente logado)
      NomePessoa: 'Cliente Teste',
      DataAtendimento: new Date().toLocaleDateString('en-CA'), // Gera "YYYY-MM-DD"
      StatusAtendimento: 'Aberto',
      Itens: itensCarrinho.map((item: any) => {
        return {
          IdAtendimento: 0,
          IdItem: item.item.Iditem || item.item.iditem,
          Item: item.item.Item1 || item.item.item1,
          IdFuncionario: 3, // Usando ID 1 de teste
          NomeFuncionario: 'Funcionario Teste',
          Cargo: 'Admin',
          Quantidade: item.quantidade,
          ValorUnitario: item.item.Preco || item.item.preco || 0
        };
      })
    };

    // Envia para o backend
    this.atendimentoService.cadastrar(pedido).subscribe({
      next: (res: any) => {
        alert('Pedido finalizado com sucesso!');
        this.carrinhoService.limpar(); // Esvazia o carrinho
        this.router.navigate(['/catalogo']); // Volta para a loja
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao finalizar pedido. Verifique se o backend está rodando.');
      }
    });
  }
}