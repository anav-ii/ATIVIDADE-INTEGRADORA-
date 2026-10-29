import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EntradaProdutoService {
  private apiUrl = 'https://localhost:7142/api/EntradaProduto';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(entrada: any): Observable<any> {
    return this.http.post(this.apiUrl, entrada);
  }
}