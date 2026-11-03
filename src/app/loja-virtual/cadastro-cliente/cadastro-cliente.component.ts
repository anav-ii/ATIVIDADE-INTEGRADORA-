// Importações do Angular
import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para o formulário
import { Router, RouterLink } from '@angular/router'; // Necessário para navegação
// Importa o serviço que envia os dados para o C#
import { PessoaService } from '../../core/services/pessoa.service';
// Importa a interface que define os campos do cliente
import { Pessoa } from '../../core/models/pessoa.model';

// Configuração do Componente
@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent {
  // Objeto que armazena os dados do formulário (inicializado vazio)
  pessoa: Pessoa = {
    Nome: '',
    CPF: 0,
    DataNascimento: '',
    Sexo: 'M',
    Email: '',
    Telefone: 0,
    AtivoPessoa: 'S', // Já começa ativo
    Enderecos: [{ CEP: '', Numero: '', Complemento: '' }] // Endereço vazio
  };

  // Injeção de dependências (Serviço, Router e ChangeDetectorRef)
  constructor(
    private pessoaService: PessoaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Função chamada ao digitar no campo de CPF (Aplica a máscara 000.000.000-00)
  formatarCPF(event: any): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, ''); // Remove tudo que não é número
    valor = valor.substring(0, 11); // Limita a 11 dígitos
    // Aplica os pontos e o traço
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.pessoa.CPF = valor;
    event.target.value = valor; // Atualiza o campo visual
  }

  // Limpa a máscara do CPF na hora de enviar para o C# (envia apenas números)
  getCpfNumeros(): number {
    const apenasNumeros = String(this.pessoa.CPF).replace(/\D/g, '');
    return Number(apenasNumeros);
  }

  // Função chamada ao clicar em "Cadastrar Cliente"
  salvar(): void {
    // Validação: verifica se os campos obrigatórios foram preenchidos
    if (!this.pessoa.Nome || !this.pessoa.CPF || !this.pessoa.Email) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF e E-mail).');
      return;
    }

    // Monta o objeto EXATAMENTE como o C# espera (PessoaDTO)
    const pessoaParaEnviar = {
      IdPessoa: 0, // 0 para o C# gerar um novo ID
      Nome: this.pessoa.Nome,
      CPF: this.getCpfNumeros(), // CPF sem máscara
      DataNascimento: this.pessoa.DataNascimento || '2000-01-01', // Data padrão se vazio
      Sexo: this.pessoa.Sexo,
      Email: this.pessoa.Email,
      Telefone: this.pessoa.Telefone,
      AtivoPessoa: 'S', // 'S' para ativo
      Enderecos: [
        {
          IdEndereco: 0,
          IdPessoa: 0,
          CEP: this.pessoa.Enderecos[0].CEP || '',
          Numero: this.pessoa.Enderecos[0].Numero || '',
          Complemento: this.pessoa.Enderecos[0].Complemento || ''
        }
      ]
    };

    console.log('Enviando para o C#:', pessoaParaEnviar); // Ajuda a debugar

    // Envia para o backend (C#)
    this.pessoaService.cadastrar(pessoaParaEnviar).subscribe({
      next: (resposta: any) => {
        alert('Cliente cadastrado com sucesso!');
        // Salva o ID do cliente no navegador (para usar no carrinho depois)
        const idCliente = resposta.idPessoa || resposta.IdPessoa;
        if (idCliente) {
          localStorage.setItem('idCliente', idCliente.toString());
        }
        this.router.navigate(['/catalogo']); // Volta para a home
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar. Verifique se o CPF já existe.');
        this.cdr.detectChanges();
      }
    });
  }
}