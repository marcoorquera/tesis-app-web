import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaVendedoresPage } from './lista-vendedores.page';

const routes: Routes = [
  {
    path: '',
    component: ListaVendedoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaVendedoresPageRoutingModule {}
