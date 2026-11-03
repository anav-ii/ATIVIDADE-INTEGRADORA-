// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o formulário
import { RouterLink } from '@angular/router'; // Necessário para o botão de voltar
// Importa o serviço que busca e cadastra os itens no banco
import { ItemService } from '../../core/services/item.service';

// Configuração do Componente
@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
  // Lista que vai receber os serviços do banco
  servicos: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;

  // ==========================================
  // Variáveis do Formulário de Cadastro
  // ==========================================
  novoCategoriaId: number | null = null; // ID da categoria (2 = Cabelo, etc)
  novoNome: string = '';                 // Nome do serviço
  novoDescricao: string = '';            // Descrição
  novoPreco: number = 0;                 // Preço do serviço

  // Injeção de dependências (Serviço e ChangeDetectorRef)
  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarServicos();
  }

  // Busca todos os itens no banco e FILTRA apenas os Serviços ('S')
  carregarServicos(): void {
    this.itemService.listar().subscribe({
      next: (dados: any) => {
        // Filtra apenas SERVIÇOS ('S'), ignorando os Produtos ('P')
        this.servicos = dados.filter((i: any) => {
          const tipo = (i.TipoItem || i.tipoItem || '').toUpperCase();
          return tipo === 'S';
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

  // Função chamada ao clicar no botão "Cadastrar Serviço"
  cadastrarServico(): void {
    // Validação: verifica se os campos obrigatórios foram preenchidos
    if (!this.novoNome || this.novoPreco <= 0 || !this.novoCategoriaId) {
      alert('Preencha os campos obrigatórios (Categoria, Nome e Preço).');
      return;
    }

    // Monta o objeto com os nomes que o C# espera (Item)
    const servicoParaEnviar = {
      Idcategoria: this.novoCategoriaId,
      Item1: this.novoNome,          // O C# espera 'Item1' (com o número 1)
      DescricaoItem: this.novoDescricao,
      Preco: this.novoPreco,
      TipoItem: 'S',                 // 'S' para Serviço
      AtivoProdutoServico: 'S'       // 'S' para Ativo
    };

    console.log('Enviando para o C#:', servicoParaEnviar); // Ajuda a debugar

    // Envia para o backend (C#)
    this.itemService.cadastrar(servicoParaEnviar).subscribe({
      next: () => {
        alert('Serviço cadastrado com sucesso!');
        // Limpa o formulário
        this.novoCategoriaId = null;
        this.novoNome = '';
        this.novoDescricao = '';
        this.novoPreco = 0;
        this.carregarServicos(); // Recarrega a lista
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar serviço.');
      }
    });
  }

  // Função para ATIVAR ou DESATIVAR um serviço
  alternarStatus(servico: any): void {
    const statusAtual = servico.AtivoProdutoServico || servico.ativoProdutoServico;
    // Se estiver ativo ('S'), vira inativo ('N'). Se estiver inativo, vira ativo.
    const novoStatus = (statusAtual === 'S' || statusAtual === 'ativo') ? 'N' : 'S';
    
    const servicoAtualizado = {
      ...servico,
      AtivoProdutoServico: novoStatus,
      ativoProdutoServico: novoStatus
    };

    const id = servico.Iditem || servico.iditem;

    // Envia a atualização para o backend (C#)
    this.itemService.atualizar(id, servicoAtualizado).subscribe({
      next: () => {
        alert('Status do serviço alterado!');
        this.carregarServicos(); // Recarrega a lista
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