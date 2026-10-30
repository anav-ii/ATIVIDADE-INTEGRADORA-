import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../core/services/pessoa.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  getId(c: any): number { return c.idPessoa || c.IdPessoa; }
  getNome(c: any): string { return c.nome || c.Nome || 'Sem nome'; }
  getCpf(c: any): string { return c.cpf || c.CPF || 'Sem CPF'; }
  getEmail(c: any): string { return c.email || c.Email || 'Sem e-mail'; }
  getTelefone(c: any): string { return c.telefone || c.Telefone || 'Sem telefone'; }
}