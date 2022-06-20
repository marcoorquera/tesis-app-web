import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCotizarPageRoutingModule } from './list-cotizar-routing.module';

import { ListCotizarPage } from './list-cotizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCotizarPageRoutingModule
  ],
  declarations: [ListCotizarPage]
})
export class ListCotizarPageModule {}
