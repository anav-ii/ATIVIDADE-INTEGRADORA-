import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../core/services/categoria.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  carregando: boolean = true;
  
  // Objeto para o formulário de cadastro
  novaCategoria: any = { Categoriacol: '' };

  // Variáveis para o modo de EDIÇÃO
  categoriaEditando: any = null;
  nomeEditado: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => {
        this.categorias = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cadastrarCategoria(): void {
    if (!this.novaCategoria.Categoriacol || this.novaCategoria.Categoriacol.trim() === '') {
      alert('Digite o nome da categoria.');
      return;
    }

    this.categoriaService.cadastrar(this.novaCategoria).subscribe({
      next: () => {
        alert('Categoria cadastrada com sucesso!');
        this.novaCategoria = { Categoriacol: '' };
        this.carregarCategorias();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar categoria.');
      }
    });
  }

  // ==========================================
  // Funções de EDIÇÃO
  // ==========================================
  editarCategoria(cat: any): void {
    this.categoriaEditando = cat;
    this.nomeEditado = this.getNome(cat);
  }

  cancelarEdicao(): void {
    this.categoriaEditando = null;
    this.nomeEditado = '';
  }

  salvarEdicao(cat: any): void {
    if (!this.nomeEditado || this.nomeEditado.trim() === '') {
      alert('O nome da categoria não pode ser vazio.');
      return;
    }

    const id = this.getId(cat);
    const categoriaAtualizada = {
      Idcategoria: id,
      Categoriacol: this.nomeEditado
    };

    this.categoriaService.atualizar(id, categoriaAtualizada).subscribe({
      next: () => {
        alert('Categoria atualizada com sucesso!');
        this.categoriaEditando = null;
        this.nomeEditado = '';
        this.carregarCategorias();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao atualizar categoria.');
      }
    });
  }

  // ==========================================
  // Funções de DESATIVAR / ATIVAR
  // ==========================================
  
  // Verifica se a categoria está desativada (começa com "[Desativada]")
  isDesativada(cat: any): boolean {
    const nome = this.getNome(cat);
    return nome.startsWith('[Desativada]');
  }

  // Desativa a categoria (adiciona o prefixo)
  desativarCategoria(cat: any): void {
    const id = this.getId(cat);
    const nomeAtual = this.getNome(cat);

    if (confirm(`Tem certeza que deseja desativar a categoria "${nomeAtual}"?`)) {
      const categoriaAtualizada = {
        Idcategoria: id,
        Categoriacol: '[Desativada] ' + nomeAtual
      };

      this.categoriaService.atualizar(id, categoriaAtualizada).subscribe({
        next: () => {
          alert('Categoria desativada com sucesso!');
          this.carregarCategorias();
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro ao desativar categoria.');
        }
      });
    }
  }

  // Ativa a categoria (remove o prefixo)
  ativarCategoria(cat: any): void {
    const id = this.getId(cat);
    const nomeAtual = this.getNome(cat);
    const nomeLimpo = nomeAtual.replace('[Desativada] ', '');

    if (confirm(`Tem certeza que deseja ativar a categoria "${nomeLimpo}"?`)) {
      const categoriaAtualizada = {
        Idcategoria: id,
        Categoriacol: nomeLimpo
      };

      this.categoriaService.atualizar(id, categoriaAtualizada).subscribe({
        next: () => {
          alert('Categoria ativada com sucesso!');
          this.carregarCategorias();
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro ao ativar categoria.');
        }
      });
    }
  }

  // ==========================================
  // Funções Auxiliares
  // ==========================================
  getId(c: any): number { return c.idcategoria || c.Idcategoria; }
  getNome(c: any): string { return c.categoriacol || c.Categoriacol || 'Sem nome'; }
}