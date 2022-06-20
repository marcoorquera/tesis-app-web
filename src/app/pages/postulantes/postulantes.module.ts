import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostulantesPageRoutingModule } from './postulantes-routing.module';

import { PostulantesPage } from './postulantes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostulantesPageRoutingModule
  ],
  declarations: [PostulantesPage]
})
export class PostulantesPageModule {}
