import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = 'https://localhost:7142/api/Categorium';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(categoria: any): Observable<any> {
    return this.http.post(this.apiUrl, categoria);
  }

  atualizar(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, categoria);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}