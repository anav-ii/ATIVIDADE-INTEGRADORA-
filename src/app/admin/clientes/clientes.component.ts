import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Importante
import { PessoaService } from '../../core/services/pessoa.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink], // Adicionado RouterLink
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  carregando: boolean = true;

  constructor(
    private pessoaService: PessoaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.pessoaService.listar().subscribe({
      next: (dados: any) => {
        this.clientes = dados;
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

  // Funções auxiliares (com os nomes exatos do JSON do C#)
  getId(c: any): number { return c.idPessoa || c.IdPessoa; }
  getNome(c: any): string { return c.nome || c.Nome || 'Sem nome'; }
  getCpf(c: any): string { return c.cpf || c.CPF || 'Sem CPF'; }
  getEmail(c: any): string { return c.email || c.Email || 'Sem e-mail'; }
  getTelefone(c: any): string { return c.telefone || c.Telefone || 'Sem telefone'; }
  
  getDataNascimento(c: any): string { 
    return c.dataNascimento || c.DataNascimento || 'Sem data'; 
  }

  getEndereco(c: any): any {
    // Pega a lista de endereços (minúsculo ou maiúsculo)
    const enderecos = c.enderecos || c.Enderecos || [];
    
    if (enderecos.length > 0) {
      const e = enderecos[0];
      return {
        // Pega o CEP de qualquer forma que vier
        CEP: e.cep || e.CEP || '',
        Numero: e.numero || e.Numero || '',
        Complemento: e.complemento || e.Complemento || ''
      };
    }
    return null;
  }
  
}