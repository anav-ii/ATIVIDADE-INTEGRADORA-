import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../core/services/ategoria.service';
import { RouterLink } from '@angular/router'; 

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
  
  // Objeto para o formulário
  novaCategoria: any = {
    Categoriacol: ''
  };

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
        this.novaCategoria = { Categoriacol: '' }; // Limpa o campo
        this.carregarCategorias(); // Recarrega a lista
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar categoria.');
      }
    });
  }

  // Funções auxiliares
  getId(c: any): number { return c.idcategoria || c.Idcategoria; }
  getNome(c: any): string { return c.categoriacol || c.Categoriacol || 'Sem nome'; }
}