import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ItemService } from '../../core/services/item.service';

@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
  servicos: any[] = [];
  carregando: boolean = true;

  // Variáveis do formulário de cadastro
  novoCategoriaId: number | null = null;
  novoNome: string = '';
  novoDescricao: string = '';
  novoPreco: number = 0;

  // Variáveis para EDIÇÃO
  servicoEditando: any = null;
  dadosEdicao: any = {};

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        this.servicos = dados.filter((i: any) => {
          const tipo = (i.TipoItem || i.tipoItem || '').toUpperCase();
          return tipo === 'S';
        });
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

  cadastrarServico(): void {
    if (!this.novoNome || this.novoPreco <= 0 || !this.novoCategoriaId) {
      alert('Preencha os campos obrigatórios (Categoria, Nome e Preço).');
      return;
    }

    const servicoParaEnviar = {
      Idcategoria: this.novoCategoriaId,
      Item1: this.novoNome,
      DescricaoItem: this.novoDescricao,
      Preco: this.novoPreco,
      TipoItem: 'S',
      AtivoProdutoServico: 'S'
    };

    this.itemService.cadastrar(servicoParaEnviar).subscribe({
      next: () => {
        alert('Serviço cadastrado com sucesso!');
        this.novoCategoriaId = null;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = 0;
        this.carregarServicos();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar serviço.');
      }
    });
  }

  // ==========================================
  // Funções de EDIÇÃO
  // ==========================================
  editarServico(servico: any): void {
    this.servicoEditando = servico;
    this.dadosEdicao = {
      Item1: this.getNome(servico),
      Preco: this.getPreco(servico),
      DescricaoItem: servico.DescricaoItem || servico.descricaoItem || ''
    };
  }

  cancelarEdicao(): void {
    this.servicoEditando = null;
    this.dadosEdicao = {};
  }

  salvarEdicao(servico: any): void {
    const id = this.getId(servico);
    const servicoAtualizado = {
      Iditem: id,
      Idcategoria: servico.Idcategoria || servico.idcategoria,
      Item1: this.dadosEdicao.Item1,
      DescricaoItem: this.dadosEdicao.DescricaoItem,
      Preco: this.dadosEdicao.Preco,
      TipoItem: 'S',
      AtivoProdutoServico: servico.AtivoProdutoServico || servico.ativoProdutoServico || 'S'
    };

    this.itemService.atualizar(id, servicoAtualizado).subscribe({
      next: () => {
        alert('Serviço atualizado com sucesso!');
        this.servicoEditando = null;
        this.carregarServicos();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao atualizar serviço.');
      }
    });
  }

  alternarStatus(servico: any): void {
    const statusAtual = servico.AtivoProdutoServico || servico.ativoProdutoServico;
    const novoStatus = (statusAtual === 'S' || statusAtual === 'ativo') ? 'N' : 'S';
    
    const servicoAtualizado = {
      ...servico,
      AtivoProdutoServico: novoStatus,
      ativoProdutoServico: novoStatus
    };

    const id = servico.Iditem || servico.iditem;

    this.itemService.atualizar(id, servicoAtualizado).subscribe({
      next: () => {
        alert('Status do serviço alterado!');
        this.carregarServicos();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao alterar status.');
      }
    });
  }

  // ==========================================
  // Funções Auxiliares
  // ==========================================
  getNome(item: any): string { return item.Item1 || item.item1 || 'Sem nome'; }
  getPreco(item: any): number { return item.Preco !== undefined ? item.Preco : (item.preco || 0); }
  getAtivo(item: any): string { return item.AtivoProdutoServico || item.ativoProdutoServico || 'N'; }
  getId(item: any): number { return item.Iditem || item.iditem; }
  
  isAtivo(item: any): boolean {
    const status = (item.AtivoProdutoServico || item.ativoProdutoServico || '').toUpperCase();
    return status === 'S' || status === 'ATIVO';
  }
}