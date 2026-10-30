import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  protected apiUrl = 'https://localhost:7142/api';
  constructor(protected http: HttpClient) {}
}