import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../core/services/carrinho.service';
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
    private atendimentoService: AtendimentoService,
    private router: Router,
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

  getNome(item: any): string {
    return item.Item1 || item.item1 || 'Sem nome';
  }
  
  getPreco(item: any): number {
    return item.Preco !== undefined ? item.Preco : (item.preco || 0);
  }

  finalizarPedido(): void {
    if (this.itens.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Pega o ID do cliente que foi salvo no localStorage durante o cadastro.
    // Se não existir, usa o ID 3 como fallback (joao da silva).
    const idClienteSalvo = localStorage.getItem('idCliente');
    const idPessoaParaEnviar = idClienteSalvo ? Number(idClienteSalvo) : 3;

    // Monta o JSON exatamente como o seu backend C# espera (AtendimentoPostDTO)
    const pedido = {
      IdAtendimento: 0,
      IdPessoa: idPessoaParaEnviar,
      NomePessoa: 'Cliente ' + idPessoaParaEnviar,
      DataAtendimento: new Date().toLocaleDateString('en-CA'), // Gera "YYYY-MM-DD"
      StatusAtendimento: 'Aberto',
      Itens: this.itens.map((itemCarrinho: any) => {
        return {
          IdAtendimento: 0,
          IdItem: itemCarrinho.item.Iditem || itemCarrinho.item.iditem,
          Item: itemCarrinho.item.Item1 || itemCarrinho.item.item1,
          IdFuncionario: 3, // Usando o ID do joao da silva (funcionário válido)
          NomeFuncionario: 'joao da silva',
          Cargo: 'mecanico',
          Quantidade: itemCarrinho.quantidade,
          ValorUnitario: itemCarrinho.item.Preco || itemCarrinho.item.preco || 0
        };
      })
    };

    console.log('Enviando pedido:', pedido);

    // Envia para a API
    this.atendimentoService.cadastrar(pedido).subscribe({
      next: (res: any) => {
        alert('Pedido finalizado com sucesso!');
        this.carrinhoService.limpar(); // Limpa o carrinho
        this.router.navigate(['/catalogo']); // Volta para a loja
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao finalizar pedido. Verifique se o backend está rodando.');
      }
    });
  }
}