// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Necessário para navegação
// Importa o serviço do carrinho (que guarda os itens na memória)
import { CarrinhoService, ItemCarrinho } from '../../core/services/carrinho.service';
// Importa o serviço que envia o pedido para o C#
import { AtendimentoService } from '../../core/services/atendimento.service';

// Configuração do Componente
@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  // Lista que recebe os itens do carrinho
  itens: ItemCarrinho[] = [];
  // Valor total do carrinho
  total: number = 0;

  // Injeção de dependências
  constructor(
    private carrinhoService: CarrinhoService,
    private atendimentoService: AtendimentoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    // Inscreve-se no Observable do carrinho para saber quando os itens mudam
    this.carrinhoService.getItens().subscribe((dados: any) => {
      this.itens = dados; // Atualiza a lista de itens
      this.total = this.carrinhoService.getTotal(); // Calcula o total
      this.cdr.detectChanges(); // Força o Angular a atualizar a tela
    });
  }

  // Remove um item do carrinho pelo ID
  removerItem(idItem: number): void {
    this.carrinhoService.remover(idItem);
  }

  // Limpa todo o carrinho
  limparCarrinho(): void {
    this.carrinhoService.limpar();
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  
  // Pega o nome do item (lida com maiúsculo/minúsculo)
  getNome(item: any): string {
    return item.Item1 || item.item1 || 'Sem nome';
  }
  
  // Pega o preço do item (lida com maiúsculo/minúsculo)
  getPreco(item: any): number {
    return item.Preco !== undefined ? item.Preco : (item.preco || 0);
  }

  // ==========================================
  // Função para FINALIZAR o pedido
  // ==========================================
  finalizarPedido(): void {
    // Se o carrinho estiver vazio, avisa e para
    if (this.itens.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    // Pega o ID do cliente que foi salvo no localStorage durante o cadastro.
    // Se não existir (cliente não cadastrado), usa o ID 3 como fallback.
    const idClienteSalvo = localStorage.getItem('idCliente');
    const idPessoaParaEnviar = idClienteSalvo ? Number(idClienteSalvo) : 3;

    // Monta o JSON exatamente como o C# espera (AtendimentoPostDTO)
    const pedido = {
      IdAtendimento: 0, // 0 para o C# gerar um novo ID
      IdPessoa: idPessoaParaEnviar, // ID do cliente logado
      NomePessoa: 'Cliente ' + idPessoaParaEnviar,
      DataAtendimento: new Date().toLocaleDateString('en-CA'), // Data de hoje no formato YYYY-MM-DD
      StatusAtendimento: 'Aberto', // Todo pedido nasce com status 'Aberto'
      Itens: this.itens.map((itemCarrinho: any) => {
        return {
          IdAtendimento: 0,
          IdItem: itemCarrinho.item.Iditem || itemCarrinho.item.iditem,
          Item: itemCarrinho.item.Item1 || itemCarrinho.item.item1,
          IdFuncionario: 3, // ID de um funcionário válido (joao da silva)
          NomeFuncionario: 'joao da silva',
          Cargo: 'mecanico',
          Quantidade: itemCarrinho.quantidade,
          ValorUnitario: itemCarrinho.item.Preco || itemCarrinho.item.preco || 0
        };
      })
    };

    console.log('Enviando pedido:', pedido); // Ajuda a debugar

    // Envia para o backend (C#)
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