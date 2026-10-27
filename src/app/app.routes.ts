import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', 
  redirectTo: 'catalogo', 
  pathMatch: 'full' },
  { 
    path: 'catalogo', 
    loadComponent: () => import('./loja-virtual/catalogo/catalogo.component')
    .then(m => m.CatalogoComponent) 
  },
  { 
    path: 'carrinho', 
    loadComponent: () => import('./loja-virtual/carrinho/carrinho.component')
    .then(m => m.CarrinhoComponent) 
  },
  { 
    path: 'cadastro', // <-- NOVA ROTA
    loadComponent: () => import('./loja-virtual/cadastro-cliente/cadastro-cliente.component').then(m => m.CadastroClienteComponent) 
  }
];