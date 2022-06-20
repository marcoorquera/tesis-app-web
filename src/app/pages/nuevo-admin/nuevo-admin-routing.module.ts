import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevoAdminPage } from './nuevo-admin.page';

const routes: Routes = [
  {
    path: '',
    component: NuevoAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevoAdminPageRoutingModule {}
