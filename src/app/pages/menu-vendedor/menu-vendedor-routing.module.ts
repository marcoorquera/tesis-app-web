import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuVendedorPage } from './menu-vendedor.page';

const routes: Routes = [
  {
    path: '',
    component: MenuVendedorPage,
    children:
    [
      {
        path: "tienda-vendedor",
        loadChildren:() => import("../tienda-vendedor/tienda-vendedor.module").then(m => m.TiendaVendedorPageModule)
      },
      {
        path: "vendedor",
        loadChildren: () => import("../vendedor/vendedor.module").then(m => m.VendedorPageModule)
      },
      {
        path: "categorias",
        loadChildren: () => import("../categorias/categorias.module").then(m => m.CategoriasPageModule) 
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuVendedorPageRoutingModule {}
