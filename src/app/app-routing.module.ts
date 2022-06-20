import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'administrador',
    loadChildren: () => import('./pages/administrador/administrador.module').then( m => m.AdministradorPageModule)
  },
  {
    path: 'vendedor',
    loadChildren: () => import('./pages/vendedor/vendedor.module').then( m => m.VendedorPageModule)
  },
  {
    path: 'postulantes',
    loadChildren: () => import('./pages/postulantes/postulantes.module').then( m => m.PostulantesPageModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./pages/productos/productos.module').then( m => m.ProductosPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/categorias/categorias.module').then( m => m.CategoriasPageModule)
  },
  {
    path: 'reset-pass',
    loadChildren: () => import('./pages/reset-pass/reset-pass.module').then( m => m.ResetPassPageModule)
  },
  {
    path: 'menu-vendedor',
    loadChildren: () => import('./pages/menu-vendedor/menu-vendedor.module').then( m => m.MenuVendedorPageModule)
  },
  {
    path: 'tienda-vendedor',
    loadChildren: () => import('./pages/tienda-vendedor/tienda-vendedor.module').then( m => m.TiendaVendedorPageModule)
  },
  {
    path: 'lista-vendedores',
    loadChildren: () => import('./pages/lista-vendedores/lista-vendedores.module').then( m => m.ListaVendedoresPageModule)
  },  {
    path: 'promociones',
    loadChildren: () => import('./pages/promociones/promociones.module').then( m => m.PromocionesPageModule)
  },
  {
    path: 'promocion-edit',
    loadChildren: () => import('./pages/promocion-edit/promocion-edit.module').then( m => m.PromocionEditPageModule)
  },
  {
    path: 'modal-editprod',
    loadChildren: () => import('./pages/modal-editprod/modal-editprod.module').then( m => m.ModalEditprodPageModule)
  },
  {
    path: 'nuevo-admin',
    loadChildren: () => import('./pages/nuevo-admin/nuevo-admin.module').then( m => m.NuevoAdminPageModule)
  },
  {
    path: 'list-cotizar',
    loadChildren: () => import('./pages/list-cotizar/list-cotizar.module').then( m => m.ListCotizarPageModule)
  },

  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
