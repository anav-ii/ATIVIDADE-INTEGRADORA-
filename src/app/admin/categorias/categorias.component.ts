// Importações do Angular e do Serviço
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// Importa o serviço de categoria (CORRIGIDO o nome do arquivo)
import { CategoriaService } from '../../core/services/ategoria.service';

// Configuração do Componente
@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  // Lista que vai receber as categorias do banco
  categorias: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;
  
  // Objeto ligado ao formulário para cadastrar uma nova categoria
  novaCategoria: any = {
    Categoriacol: ''
  };

  // Injeção de dependências (Serviço e ChangeDetectorRef para atualizar a tela)
  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarCategorias();
  }

  // Busca as categorias no banco via API
  carregarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (dados: any) => {
        this.categorias = dados; // Salva os dados na lista
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

  // Função chamada ao clicar no botão "Cadastrar"
  cadastrarCategoria(): void {
    // Validação simples: se o campo estiver vazio, avisa o usuário
    if (!this.novaCategoria.Categoriacol || this.novaCategoria.Categoriacol.trim() === '') {
      alert('Digite o nome da categoria.');
      return;
    }

    // Envia a nova categoria para o backend (C#)
    this.categoriaService.cadastrar(this.novaCategoria).subscribe({
      next: () => {
        alert('Categoria cadastrada com sucesso!');
        this.novaCategoria = { Categoriacol: '' }; // Limpa o campo
        this.carregarCategorias(); // Recarrega a lista para mostrar a nova categoria
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar categoria.');
      }
    });
  }

  // Função auxiliar para pegar o ID (lidando com maiúsculo/minúsculo do JSON)
  getId(c: any): number { return c.idcategoria || c.Idcategoria; }
  
  // Função auxiliar para pegar o Nome (lidando com maiúsculo/minúsculo do JSON)
  getNome(c: any): string { return c.categoriacol || c.Categoriacol || 'Sem nome'; }
}