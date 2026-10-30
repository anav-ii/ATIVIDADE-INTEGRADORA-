import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaService } from '../../core/services/pessoa.service';
import { Pessoa } from '../../core/models/pessoa.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.css']
})
export class CadastroClienteComponent {
  pessoa: Pessoa = {
    Nome: '',
    CPF: 0,
    DataNascimento: '',
    Sexo: 'M',
    Email: '',
    Telefone: 0,
    AtivoPessoa: 'S',
    Enderecos: [{ CEP: '', Numero: '', Complemento: '' }]
  };

  constructor(
    private pessoaService: PessoaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // Função chamada ao digitar no campo de CPF
  formatarCPF(event: any): void {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.pessoa.CPF = valor;
    event.target.value = valor;
  }

  // Limpa a máscara na hora de enviar para o C#
  getCpfNumeros(): number {
    const apenasNumeros = String(this.pessoa.CPF).replace(/\D/g, '');
    return Number(apenasNumeros);
  }

  salvar(): void {
    if (!this.pessoa.Nome || !this.pessoa.CPF || !this.pessoa.Email) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF e E-mail).');
      return;
    }

    // Monta o objeto com os nomes que o C# espera
    const pessoaParaEnviar = {
      IdPessoa: 0,
      Nome: this.pessoa.Nome,
      CPF: this.getCpfNumeros(),
      DataNascimento: this.pessoa.DataNascimento || '2000-01-01',
      Sexo: this.pessoa.Sexo,
      Email: this.pessoa.Email,
      Telefone: this.pessoa.Telefone,
      AtivoPessoa: 'S',
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

    this.pessoaService.cadastrar(pessoaParaEnviar).subscribe({
      next: (resposta: any) => {
        alert('Cliente cadastrado com sucesso!');
        // Salva o ID do cliente para usar no carrinho
        const idCliente = resposta.IdPessoa || resposta.idPessoa;
        if (idCliente) {
          localStorage.setItem('idCliente', idCliente.toString());
        }
        this.router.navigate(['/catalogo']);
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar. Verifique se o CPF já existe ou se os dados estão corretos.');
        this.cdr.detectChanges();
      }
    });
  }
}