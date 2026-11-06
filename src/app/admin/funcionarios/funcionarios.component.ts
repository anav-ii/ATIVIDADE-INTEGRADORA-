import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FuncionarioService } from '../../core/services/funcionario.service';

@Component({
  selector: 'app-funcionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {
  funcionarios: any[] = [];
  carregando: boolean = true;

  // Objeto do formulário de cadastro
  novoFuncionario: any = {
    Nome: '',
    Cpf: 0,
    DataNascimento: '2000-01-01',
    Sexo: 'M',
    Email: '',
    Telefone: 0,
    AtivoPessoa: 'S',
    Cargo: '',
    DataAdmissao: new Date().toISOString().split('T')[0],
    Cep: '',
    Numero: '',
    Complemento: ''
  };

  // Variáveis para EDIÇÃO
  funcionarioEditando: any = null;
  dadosEdicao: any = {};

  constructor(
    private funcionarioService: FuncionarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarFuncionarios();
  }

  carregarFuncionarios(): void {
    this.funcionarioService.listar().subscribe({
      next: (dados: any) => {
        this.funcionarios = dados;
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

  cadastrarFuncionario(): void {
    if (!this.novoFuncionario.Nome || !this.novoFuncionario.Cargo || !this.novoFuncionario.Email) {
      alert('Preencha os campos obrigatórios (Nome, Cargo e E-mail).');
      return;
    }

    this.funcionarioService.cadastrar(this.novoFuncionario).subscribe({
      next: () => {
        alert('Funcionário cadastrado com sucesso!');
        this.limparFormulario();
        this.carregarFuncionarios();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao cadastrar funcionário.');
      }
    });
  }

  limparFormulario(): void {
    this.novoFuncionario = {
      Nome: '',
      Cpf: 0,
      DataNascimento: '2000-01-01',
      Sexo: 'M',
      Email: '',
      Telefone: 0,
      AtivoPessoa: 'S',
      Cargo: '',
      DataAdmissao: new Date().toISOString().split('T')[0],
      Cep: '',
      Numero: '',
      Complemento: ''
    };
  }

  // ==========================================
  // Funções de EDIÇÃO
  // ==========================================
  editarFuncionario(func: any): void {
    this.funcionarioEditando = func;
    this.dadosEdicao = {
      Nome: this.getNome(func),
      Cargo: this.getCargo(func),
      Email: this.getEmail(func),
      Cpf: func.cpf || func.Cpf || 0,
      Telefone: func.telefone || func.Telefone || 0,
      DataAdmissao: func.dataAdmissao || func.DataAdmissao || '',
      Cep: func.cep || func.Cep || '',
      Numero: func.numero || func.Numero || '',
      Complemento: func.complemento || func.Complemento || ''
    };
  }

  cancelarEdicao(): void {
    this.funcionarioEditando = null;
    this.dadosEdicao = {};
  }

  salvarEdicao(func: any): void {
    const id = this.getId(func);
    const funcionarioAtualizado = {
      Nome: this.dadosEdicao.Nome,
      Cpf: this.dadosEdicao.Cpf,
      DataNascimento: func.dataNascimento || func.DataNascimento || '2000-01-01',
      Sexo: func.sexo || func.Sexo || 'M',
      Email: this.dadosEdicao.Email,
      Telefone: this.dadosEdicao.Telefone,
      AtivoPessoa: func.ativoPessoa || func.AtivoPessoa || 'S',
      Cargo: this.dadosEdicao.Cargo,
      DataAdmissao: this.dadosEdicao.DataAdmissao,
      Cep: this.dadosEdicao.Cep,
      Numero: this.dadosEdicao.Numero,
      Complemento: this.dadosEdicao.Complemento
    };

    this.funcionarioService.atualizar(id, funcionarioAtualizado).subscribe({
      next: () => {
        alert('Funcionário atualizado com sucesso!');
        this.funcionarioEditando = null;
        this.carregarFuncionarios();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao atualizar funcionário.');
      }
    });
  }

  // ==========================================
  // Funções de ATIVAR / DESATIVAR
  // ==========================================
  
  // Verifica se o funcionário está ativo
  isAtivo(f: any): boolean {
    const status = (f.ativoPessoa || f.AtivoPessoa || '').toUpperCase();
    return status === 'S' || status === 'ATIVO';
  }

  desativarFuncionario(func: any): void {
    const id = this.getId(func);
    const nome = this.getNome(func);
    
    if (confirm(`Tem certeza que deseja desativar o funcionário "${nome}"?`)) {
      const funcionarioAtualizado = {
        Nome: this.getNome(func),
        Cpf: func.cpf || func.Cpf || 0,
        DataNascimento: func.dataNascimento || func.DataNascimento || '2000-01-01',
        Sexo: func.sexo || func.Sexo || 'M',
        Email: this.getEmail(func),
        Telefone: func.telefone || func.Telefone || 0,
        AtivoPessoa: 'N', // Desativado
        Cargo: this.getCargo(func),
        DataAdmissao: func.dataAdmissao || func.DataAdmissao || '',
        Cep: func.cep || func.Cep || '',
        Numero: func.numero || func.Numero || '',
        Complemento: func.complemento || func.Complemento || ''
      };

      this.funcionarioService.atualizar(id, funcionarioAtualizado).subscribe({
        next: () => {
          alert('Funcionário desativado com sucesso!');
          this.carregarFuncionarios();
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro ao desativar funcionário.');
        }
      });
    }
  }

  ativarFuncionario(func: any): void {
    const id = this.getId(func);
    const nome = this.getNome(func);
    
    if (confirm(`Tem certeza que deseja ativar o funcionário "${nome}"?`)) {
      const funcionarioAtualizado = {
        Nome: this.getNome(func),
        Cpf: func.cpf || func.Cpf || 0,
        DataNascimento: func.dataNascimento || func.DataNascimento || '2000-01-01',
        Sexo: func.sexo || func.Sexo || 'M',
        Email: this.getEmail(func),
        Telefone: func.telefone || func.Telefone || 0,
        AtivoPessoa: 'S', // Ativado
        Cargo: this.getCargo(func),
        DataAdmissao: func.dataAdmissao || func.DataAdmissao || '',
        Cep: func.cep || func.Cep || '',
        Numero: func.numero || func.Numero || '',
        Complemento: func.complemento || func.Complemento || ''
      };

      this.funcionarioService.atualizar(id, funcionarioAtualizado).subscribe({
        next: () => {
          alert('Funcionário ativado com sucesso!');
          this.carregarFuncionarios();
        },
        error: (err: any) => {
          console.error(err);
          alert('Erro ao ativar funcionário.');
        }
      });
    }
  }

  // ==========================================
  // Funções Auxiliares
  // ==========================================
  getNome(f: any): string { return f.nome || f.Nome || 'Sem nome'; }
  getCargo(f: any): string { return f.cargo || f.Cargo || 'Sem cargo'; }
  getEmail(f: any): string { return f.email || f.Email || 'Sem e-mail'; }
  getCpf(f: any): string { return f.cpf || f.Cpf || 'Sem CPF'; }
  getId(f: any): number { return f.idpessoa || f.Idpessoa; }
}