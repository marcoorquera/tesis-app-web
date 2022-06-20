import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromocionEditPage } from './promocion-edit.page';

const routes: Routes = [
  {
    path: '',
    component: PromocionEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromocionEditPageRoutingModule {}
