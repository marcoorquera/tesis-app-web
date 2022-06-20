import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostulantesPage } from './postulantes.page';

const routes: Routes = [
  {
    path: '',
    component: PostulantesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostulantesPageRoutingModule {}
