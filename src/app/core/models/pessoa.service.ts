import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../models/pessoa.model';

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private apiUrl = 'https://localhost:7142/api/PessoaEndereco'; // Rota do seu backend

  constructor(private http: HttpClient) {}

  cadastrar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }
}