import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', loadComponent: () => import('./loja-virtual/catalogo/catalogo.component').then(m => m.CatalogoComponent) },
  { path: 'carrinho', loadComponent: () => import('./loja-virtual/carrinho/carrinho.component').then(m => m.CarrinhoComponent) },
  { path: 'cadastro', loadComponent: () => import('./loja-virtual/cadastro-cliente/cadastro-cliente.component').then(m => m.CadastroClienteComponent) },

  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin/produtos', loadComponent: () => import('./admin/produtos/produtos.component').then(m => m.ProdutosComponent) },
  
  { path: 'admin/pedidos', loadComponent: () => import('./admin/pedidos/pedidos.component').then(m => m.PedidosComponent) },
  
  { path: 'admin/estoque', loadComponent: () => import('./admin/estoque/estoque.component').then(m => m.EstoqueComponent) }
];