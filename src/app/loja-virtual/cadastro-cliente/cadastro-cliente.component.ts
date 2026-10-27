import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PessoaService } from '../../core/models/pessoa.service';
import { Pessoa } from '../../core/models/pessoa.model';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  salvar(): void {
    // Verifica se os campos obrigatórios estão preenchidos
    if (!this.pessoa.Nome || !this.pessoa.CPF || !this.pessoa.Email) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF e E-mail).');
      return;
    }

    this.pessoaService.cadastrar(this.pessoa).subscribe({
      next: () => {
        alert('Cliente cadastrado com sucesso!');
        this.router.navigate(['/catalogo']); // Volta para a loja
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar. Verifique se o backend está rodando.');
        this.cdr.detectChanges();
      }
    });
  }
}