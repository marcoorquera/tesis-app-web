import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiendaVendedorPage } from './tienda-vendedor.page';

const routes: Routes = [
  {
    path: '',
    component: TiendaVendedorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiendaVendedorPageRoutingModule {}
