import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  // A URL base termina em /Atendimento
  private apiUrl = 'https://localhost:7142/api/Atendimento';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(atendimento: any): Observable<any> {
    return this.http.post(this.apiUrl, atendimento);
  }

  // A URL de atualizar usa a base + /id (sem repetir o Atendimento)
  atualizar(id: number, atendimento: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, atendimento);
  }
}