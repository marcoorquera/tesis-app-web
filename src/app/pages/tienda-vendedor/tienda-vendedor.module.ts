import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TiendaVendedorPageRoutingModule } from './tienda-vendedor-routing.module';

import { TiendaVendedorPage } from './tienda-vendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TiendaVendedorPageRoutingModule
  ],
  declarations: [TiendaVendedorPage]
})
export class TiendaVendedorPageModule {}
