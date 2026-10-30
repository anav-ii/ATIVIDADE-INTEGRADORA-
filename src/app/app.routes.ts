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
  
  { path: 'admin/estoque', loadComponent: () => import('./admin/estoque/estoque.component').then(m => m.EstoqueComponent) },

  { path: 'admin/clientes', loadComponent: () => import('./admin/clientes/clientes.component').then(m => m.ClientesComponent) },

  { path: 'admin/categorias', loadComponent: () => import('./admin/categorias/categorias.component').then(m => m.CategoriasComponent) },

  { path: 'meus-pedidos', loadComponent: () => import('./loja-virtual/meus-pedidos/meus-pedidos.component').then(m => m.MeusPedidosComponent) },

  { path: 'admin/entradas-produtos', loadComponent: () => import('./admin/entradas-produtos/entradas-produtos.component').then(m => m.EntradasProdutosComponent) },

  { path: 'admin/servicos', loadComponent: () => import('./admin/servicos/servicos.component').then(m => m.ServicosComponent) }
];