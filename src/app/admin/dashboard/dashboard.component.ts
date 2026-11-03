// Importações do Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Configuração do Componente
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // RouterLink é necessário para os links do menu
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Essa tela não tem lógica no TypeScript (apenas exibe os botões)
  // Toda a navegação é feita pelo HTML usando routerLink
}