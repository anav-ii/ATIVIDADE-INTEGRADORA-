// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o formulário (ngModel)
// Importa os serviços que conversam com o banco
import { EntradaProdutoService } from '../../core/services/entrada-produto.service';
import { EstoqueService } from '../../core/services/estoque.service';
import { RouterLink } from '@angular/router'; // Para o botão de voltar

// Configuração do Componente
@Component({
  selector: 'app-entradas-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './entradas-produtos.component.html',
  styleUrls: ['./entradas-produtos.component.css']
})
export class EntradasProdutosComponent implements OnInit {
  // Lista que vai receber o histórico de entradas do banco
  entradas: any[] = [];
  // Lista que vai receber os produtos para preencher o select do formulário
  produtos: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;

  // Objeto ligado ao formulário de registro de entrada
  novaEntrada: any = {
    iditem: null,
    dataEntradaProduto: new Date().toISOString().split('T')[0], // Pega a data de hoje
    quantidadeEntrada: 1,
    unidade: 'UN',
    valorUnitarioEntrada: 0
  };

  // Injeção de dependências (Serviços e ChangeDetectorRef)
  constructor(
    private entradaService: EntradaProdutoService,
    private estoqueService: EstoqueService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarDados();
  }

  // Busca os produtos e o histórico de entradas no banco
  carregarDados(): void {
    // Busca os produtos (para o select)
    this.estoqueService.listar().subscribe({
      next: (dados: any) => {
        // Filtra apenas itens do tipo 'P' (Produto)
        this.produtos = dados.filter((i: any) => (i.tipoItem || i.TipoItem) === 'P');
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });

    // Busca o histórico de entradas
    this.entradaService.listar().subscribe({
      next: (dados: any) => {
        this.entradas = dados;
        this.carregando = false; // Para de mostrar "Carregando"
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  // Função chamada ao clicar no botão "Registrar Entrada"
  registrarEntrada(): void {
    // Validação: verifica se o produto foi selecionado e a quantidade é válida
    if (!this.novaEntrada.iditem || this.novaEntrada.quantidadeEntrada <= 0) {
      alert('Preencha os dados corretamente.');
      return;
    }

    // Garante que o valor unitário não seja zero (exigência do backend)
    let valorUnitario = this.novaEntrada.valorUnitarioEntrada;
    if (!valorUnitario || valorUnitario <= 0) {
      valorUnitario = 1.00;
    }

    // Monta o objeto com os nomes exatos que o C# espera (EntradaProdutoDTO)
    const entradaParaEnviar = {
      Iditem: Number(this.novaEntrada.iditem),
      DataEntradaProduto: this.novaEntrada.dataEntradaProduto,
      QuantidadeEntrada: Number(this.novaEntrada.quantidadeEntrada),
      Unidade: this.novaEntrada.unidade,
      ValorUnitarioEntrada: valorUnitario
    };

    // Envia para o backend (C#)
    this.entradaService.cadastrar(entradaParaEnviar).subscribe({
      next: () => {
        alert('Entrada registrada e estoque atualizado!');
        // Limpa o formulário
        this.novaEntrada = {
          iditem: null,
          dataEntradaProduto: new Date().toISOString().split('T')[0],
          quantidadeEntrada: 1,
          unidade: 'UN',
          valorUnitarioEntrada: 0
        };
        this.carregarDados(); // Recarrega a lista
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao registrar entrada. Verifique o console.');
      }
    });
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  
  // Pega o nome do produto pelo ID (para exibir na tabela)
  getNomeProduto(id: number): string {
    const p = this.produtos.find((x: any) => (x.idItem || x.IdItem) === id);
    return p ? (p.nomeItem || p.NomeItem) : 'Produto ' + id;
  }
  
  // Pega o ID da entrada
  getIdEntrada(e: any): number { return e.identradaProduto || e.IdentradaProduto; }
  
  // Pega a data da entrada
  getData(e: any): string { return e.dataEntradaProduto || e.DataEntradaProduto; }
  
  // Pega a quantidade da entrada
  getQtd(e: any): number { return e.quantidadeEntrada || e.QuantidadeEntrada; }
  
  // Pega o valor unitário da entrada
  getValor(e: any): number { return e.valorUnitarioEntrada || e.ValorUnitarioEntrada; }
}