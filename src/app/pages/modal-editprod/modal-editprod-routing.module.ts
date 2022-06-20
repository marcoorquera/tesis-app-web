import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalEditprodPage } from './modal-editprod.page';

const routes: Routes = [
  {
    path: '',
    component: ModalEditprodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalEditprodPageRoutingModule {}
