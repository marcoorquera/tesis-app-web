import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalEditprodPageRoutingModule } from './modal-editprod-routing.module';

import { ModalEditprodPage } from './modal-editprod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalEditprodPageRoutingModule
  ],
  declarations: [ModalEditprodPage]
})
export class ModalEditprodPageModule {}
