import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  // IMPORTANTE: Verifique a porta do seu backend (ex: 7001, 5001, 5000)
  private apiUrl = 'https://localhost:7142/api/ItemServico'; 

  constructor(private http: HttpClient) {}

  listar(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  atualizar(id: number, item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }
}