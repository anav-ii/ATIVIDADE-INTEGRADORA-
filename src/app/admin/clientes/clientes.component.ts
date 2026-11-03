// Importações do Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importante para o botão de voltar
// Importa o serviço de pessoa (cliente) para buscar os dados no banco
import { PessoaService } from '../../core/services/pessoa.service';

// Configuração do Componente
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink], // Adicionado RouterLink para funcionar o link de voltar
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  // Lista que vai receber os clientes do banco
  clientes: any[] = [];
  // Controla a mensagem de "Carregando..."
  carregando: boolean = true;

  // Injeção de dependências (Serviço e ChangeDetectorRef)
  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {}

  // Executa assim que a tela é aberta
  ngOnInit(): void {
    this.carregarClientes();
  }

  // Busca todos os clientes cadastrados no banco
  carregarClientes(): void {
    this.pessoaService.listar().subscribe({
      next: (dados: any) => {
        this.clientes = dados; // Salva os dados na lista
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
  
  // Pega o ID do cliente (lida com maiúsculo/minúsculo)
  getId(c: any): number { return c.idPessoa || c.IdPessoa; }
  
  // Pega o Nome (lida com maiúsculo/minúsculo)
  getNome(c: any): string { return c.nome || c.Nome || 'Sem nome'; }
  
  // Pega o CPF (lida com maiúsculo/minúsculo)
  getCpf(c: any): string { return c.cpf || c.CPF || 'Sem CPF'; }
  
  // Pega o Email (lida com maiúsculo/minúsculo)
  getEmail(c: any): string { return c.email || c.Email || 'Sem e-mail'; }
  
  // Pega o Telefone (lida com maiúsculo/minúsculo)
  getTelefone(c: any): string { return c.telefone || c.Telefone || 'Sem telefone'; }
  
  // Pega a Data de Nascimento
  getDataNascimento(c: any): string { 
    return c.dataNascimento || c.DataNascimento || 'Sem data'; 
  }

  // Pega o primeiro endereço da lista (se existir)
  getEndereco(c: any): any {
    // Pega a lista de endereços (minúsculo ou maiúsculo)
    const enderecos = c.enderecos || c.Enderecos || [];
    
    if (enderecos.length > 0) {
      const e = enderecos[0]; // Pega o primeiro endereço
      return {
        CEP: e.cep || e.CEP || '',
        Numero: e.numero || e.Numero || '',
        Complemento: e.complemento || e.Complemento || ''
      };
    }
    return null; // Se não tiver endereço, retorna nulo
  }
}