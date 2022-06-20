import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuVendedorPageRoutingModule } from './menu-vendedor-routing.module';

import { MenuVendedorPage } from './menu-vendedor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuVendedorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MenuVendedorPage]
})
export class MenuVendedorPageModule {}
