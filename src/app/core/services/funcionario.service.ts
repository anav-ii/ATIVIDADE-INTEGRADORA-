import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private apiUrl = 'https://localhost:7142/api/Funcionario';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(funcionario: any): Observable<any> {
    return this.http.post(this.apiUrl, funcionario);
  }

  atualizar(id: number, funcionario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, funcionario);
  }
}