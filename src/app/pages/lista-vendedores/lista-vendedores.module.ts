import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaVendedoresPageRoutingModule } from './lista-vendedores-routing.module';

import { ListaVendedoresPage } from './lista-vendedores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaVendedoresPageRoutingModule
  ],
  declarations: [ListaVendedoresPage]
})
export class ListaVendedoresPageModule {}
