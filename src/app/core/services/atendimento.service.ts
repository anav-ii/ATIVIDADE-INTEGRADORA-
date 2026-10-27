import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AtendimentoService {
  private apiUrl = 'https://localhost:7142/api/Atendimento'; // Rota do seu backend

  constructor(private http: HttpClient) {}

  cadastrar(atendimento: any): Observable<any> {
    return this.http.post(this.apiUrl, atendimento);
  }
}