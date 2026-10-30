import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ItemService {
  // A URL base já tem o /ItemServico
  private apiUrl = 'https://localhost:7142/api/ItemServico';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cadastrar(item: any): Observable<any> {
    return this.http.post(this.apiUrl, item);
  }

  atualizar(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
}