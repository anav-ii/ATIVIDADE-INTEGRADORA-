// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o formulário
import { RouterLink } from '@angular/router'; // Necessário para o botão de voltar
// Importa o serviço que busca e cadastra os itens no banco
import { ItemService } from '../../core/services/item.service';

// Configuração do Componente
@Component({
  selector: 'app-produtos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  // Lista que vai receber os produtos do banco
  itens: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;

  // ==========================================
  // Variáveis do Formulário de Cadastro
  // ==========================================
  novoCategoriaId: number | null = null; // ID da categoria (2 = Cabelo, etc)
  novoNome: string = '';                 // Nome do produto
  novoDescricao: string = '';            // Descrição
  novoPreco: number = 0;                 // Preço de custo (tabela item)
  novoPrecoVenda: number = 0;            // Preço de venda (tabela produto)
  novaUnidade: string = 'UN';            // Unidade (UN, KG, etc)

  // Injeção de dependências (Serviço e ChangeDetectorRef)
  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarItens();
  }

  // Busca todos os itens no banco e FILTRA apenas os Produtos ('P')
  carregarItens(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        // Filtra apenas PRODUTOS ('P'), ignorando os Serviços ('S')
        this.itens = dados.filter((i: any) => {
          const tipo = (i.TipoItem || i.tipoItem || '').toUpperCase();
          return tipo === 'P';
        });
        this.carregando = false; // Para de mostrar "Carregando"
        this.cdr.detectChanges(); // Força o Angular a atualizar a tela
      },
      error: (err: any) => {
        console.error(err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Função chamada ao clicar no botão "Cadastrar Produto"
  cadastrarProduto(): void {
    // Validação: verifica se os campos obrigatórios foram preenchidos
    if (!this.novoNome || this.novoPreco <= 0 || !this.novoCategoriaId) {
      alert('Preencha os campos obrigatórios (Categoria, Nome e Preço).');
      return;
    }

    // Monta o objeto com os nomes que o C# espera (ProdutoDTO)
    const produtoParaEnviar = {
      Idcategoria: this.novoCategoriaId,
      Item: this.novoNome, // O ProdutoItemController espera 'Item'
      DescricaoItem: this.novoDescricao,
      Preco: this.novoPreco,
      TipoItem: 'P', // 'P' para Produto
      AtivoProdutoServico: 'S', // 'S' para Ativo
      CodigoPreco: 1,
      PrecoVenda: this.novoPrecoVenda > 0 ? this.novoPrecoVenda : this.novoPreco,
      Unidade: this.novaUnidade
    };

    // Envia para o backend (C#) usando o endpoint de ProdutoItem
    this.itemService.cadastrarProduto(produtoParaEnviar).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        // Limpa o formulário
        this.novoCategoriaId = null;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = 0;
        this.novoPrecoVenda = 0;
        this.carregarItens(); // Recarrega a lista
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar produto.');
      }
    });
  }

  // Função para ATIVAR ou DESATIVAR um produto
  alternarStatus(item: any): void {
    const statusAtual = item.AtivoProdutoServico || item.ativoProdutoServico;
    // Se estiver ativo ('S'), vira inativo ('N'). Se estiver inativo, vira ativo.
    const novoStatus = (statusAtual === 'S' || statusAtual === 'ativo') ? 'N' : 'S';
    
    const itemAtualizado = {
      ...item,
      AtivoProdutoServico: novoStatus,
      ativoProdutoServico: novoStatus
    };

    const id = item.Iditem || item.iditem;

    // Envia a atualização para o backend (C#)
    this.itemService.atualizar(id, itemAtualizado).subscribe({
      next: () => {
        alert('Status alterado com sucesso!');
        this.carregarItens(); // Recarrega a lista
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao alterar status.');
      }
    });
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  getNome(item: any): string { return item.Item1 || item.item1 || 'Sem nome'; }
  getPreco(item: any): number { return item.Preco !== undefined ? item.Preco : (item.preco || 0); }
  getAtivo(item: any): string { return item.AtivoProdutoServico || item.ativoProdutoServico || 'N'; }
  getId(item: any): number { return item.Iditem || item.iditem; }
}