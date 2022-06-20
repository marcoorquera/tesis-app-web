import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCotizarPage } from './list-cotizar.page';

const routes: Routes = [
  {
    path: '',
    component: ListCotizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCotizarPageRoutingModule {}
