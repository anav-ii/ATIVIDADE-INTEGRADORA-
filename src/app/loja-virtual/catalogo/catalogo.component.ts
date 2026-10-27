import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../core/services/item.service';
import { CategoriaService } from '../../core/services/ategoria.service';
import { Item } from '../../core/models/item.model';
import { Categoria } from '../../core/models/categoria.model';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  itens: Item[] = [];
  itensFiltrados: Item[] = [];
  categorias: Categoria[] = [];
  
  termoBusca: string = '';
  categoriaSelecionada: number | null = null; 
  
  carregando: boolean = true;
  erro: string = '';

  constructor(
    private itemService: ItemService,
    private categoriaService: CategoriaService,
    private carrinhoService: CarrinhoService, 
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarItens();
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => { 
        this.categorias = dados;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Erro ao carregar categorias', err)
    });
  }

  carregarItens(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        this.itens = dados;
        this.itensFiltrados = dados; 
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

  aplicarFiltros(): void {
    let resultado = this.itens;

    if (this.termoBusca.trim()) {
      const termo = this.termoBusca.toLowerCase();
      resultado = resultado.filter(item => {
        const nome = (item.Item1 || (item as any).item1 || '').toLowerCase();
        return nome.includes(termo);
      });
    }

    if (this.categoriaSelecionada !== null) {
      resultado = resultado.filter(item => {
        const catId = item.Idcategoria || (item as any).idcategoria;
        return Number(catId) === Number(this.categoriaSelecionada);
      });
    }

    this.itensFiltrados = resultado;
  }

  selecionarCategoria(id: any): void {
    this.categoriaSelecionada = id ? Number(id) : null; 
    this.aplicarFiltros();
  }

  filtrarPorNome(): void {
    this.aplicarFiltros();
  }

  // Funções auxiliares
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

  adicionarAoCarrinho(item: any): void {
    this.carrinhoService.adicionar(item);
    alert(`"${this.getNome(item)}" adicionado ao carrinho!`);
  }
}