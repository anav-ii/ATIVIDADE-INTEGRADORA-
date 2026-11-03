// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o ngModel da busca
// Importa os serviços que conversam com o banco
import { ItemService } from '../../core/services/item.service';
import { CategoriaService } from '../../core/services/ategoria.service';
import { CarrinhoService } from '../../core/services/carrinho.service';
// Importa as interfaces (modelos de dados)
import { Item } from '../../core/models/item.model';
import { Categoria } from '../../core/models/categoria.model';

// Configuração do Componente
@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  // Listas que recebem os dados do banco
  itens: Item[] = [];            // Todos os itens ativos
  itensFiltrados: Item[] = [];   // Itens que aparecem na tela (após filtros)
  categorias: Categoria[] = [];  // Categorias para o menu lateral
  
  // Variáveis de controle
  termoBusca: string = '';                  // O que o usuário digitou na busca
  categoriaSelecionada: number | null = null; // ID da categoria selecionada (null = Todas)
  
  carregando: boolean = true; // Controla a mensagem de "Carregando..."
  erro: string = '';          // Mensagem de erro, se houver

  // Injeção de dependências
  constructor(
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef 
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarItens();
  }

  // Busca as categorias no banco
  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => { 
        this.categorias = dados;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao carregar categorias', err)
    });
  }

  // Busca todos os itens no banco e FILTRA apenas os ativos
  carregarItens(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        console.log('Dados recebidos da API:', dados); // Ajuda a debugar
        
        // FILTRA APENAS ITENS ATIVOS ('S' ou 'ativo')
        this.itens = dados.filter((item: any) => {
          const status = (item.AtivoProdutoServico || item.ativoProdutoServico || '').toUpperCase();
          return status === 'S' || status === 'ATIVO';
        });
        
        this.itensFiltrados = this.itens; // Começa mostrando todos
        this.carregando = false;
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        this.erro = 'Erro ao carregar produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Aplica os filtros (busca por nome + categoria)
  aplicarFiltros(): void {
    let resultado = this.itens;

    // 1. Filtro por Nome
    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(item => {
        const nome = (item.Item1 || (item as any).item1 || '').toLowerCase();
        return nome.includes(termo);
      });
    }

    // 2. Filtro por Categoria
    if (this.categoriaSelecionada !== null) {
      resultado = resultado.filter(item => {
        const catId = item.Idcategoria || (item as any).idcategoria;
        return Number(catId) === Number(this.categoriaSelecionada);
      });
    }

    this.itensFiltrados = resultado;
  }

  // Chamado quando o usuário clica em uma categoria
  selecionarCategoria(id: any): void {
    this.categoriaSelecionada = id ? Number(id) : null; 
    this.aplicarFiltros();
  }

  // Chamado quando o usuário digita na busca
  filtrarPorNome(): void {
    this.aplicarFiltros();
  }

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  
  getNome(item: any): string { 
    return item.Item1 || item.item1 || 'Sem nome'; 
  }
  
  getDescricao(item: any): string { 
    return item.DescricaoItem || item.descricaoItem || ''; 
  }
  
  getPreco(item: any): number { 
    return item.Preco !== undefined ? item.Preco : (item.preco || 0); 
  }
  
  getTipo(item: any): string {
    const tipo = (item.TipoItem || item.tipoItem || '').toUpperCase();
    return tipo === 'P' ? 'Produto' : (tipo === 'S' ? 'Serviço' : 'Item');
  }

  getNomeCategoria(cat: any): string {
    return cat.Categoriacol || cat.categoriacol || 'Sem nome';
  }

  getIdCategoria(cat: any): number {
    return cat.Idcategoria || cat.idcategoria;
  }

  // Adiciona o item ao carrinho e mostra um alerta
  adicionarAoCarrinho(item: any): void {
    this.carrinhoService.adicionar(item);
    alert(`"${this.getNome(item)}" adicionado ao carrinho!`);
  }
}