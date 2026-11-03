// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa o serviço que busca os dados do estoque no banco
import { EstoqueService } from '../../core/services/estoque.service';
import { RouterLink } from '@angular/router'; // Necessário para o botão de voltar

// Configuração do Componente
@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, RouterLink], // Adicionado RouterLink
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent implements OnInit {
  // Lista que vai receber os dados do estoque do banco
  itens: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;

  // Injeção de dependências (Serviço e ChangeDetectorRef)
  constructor(
    private estoqueService: EstoqueService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarEstoque();
  }

  // Busca os dados do estoque no banco (via view vw_produtos_estoque)
  carregarEstoque(): void {
    this.estoqueService.listar().subscribe({
      next: (dados: any) => {
        this.itens = dados; // Salva os dados na lista
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

  // ==========================================
  // Funções Auxiliares (Leitura dos dados)
  // ==========================================
  
  // Pega o nome do item (lida com maiúsculo/minúsculo)
  getNome(item: any): string { return item.nomeItem || item.NomeItem || 'Sem nome'; }
  
  // Pega o preço de venda (lida com maiúsculo/minúsculo)
  getPreco(item: any): number { return item.precoVenda || item.PrecoVenda || 0; }
  
  // Pega a quantidade em estoque (lida com maiúsculo/minúsculo)
  getQuantidade(item: any): number { return item.quantidadeEstoque || item.QuantidadeEstoque || 0; }
  
  // Pega a categoria (lida com maiúsculo/minúsculo)
  getCategoria(item: any): string { return item.categoria || item.Categoria || 'Sem categoria'; }
  
  // Verifica se o item é Produto ('P') ou Serviço ('S')
  getTipo(item: any): string {
    const tipo = (item.tipoItem || item.TipoItem || '').toUpperCase();
    return tipo === 'P' ? 'Produto' : 'Serviço';
  }
}