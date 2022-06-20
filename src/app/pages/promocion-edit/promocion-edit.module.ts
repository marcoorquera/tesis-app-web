import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromocionEditPageRoutingModule } from './promocion-edit-routing.module';

import { PromocionEditPage } from './promocion-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromocionEditPageRoutingModule
  ],
  declarations: [PromocionEditPage]
})
export class PromocionEditPageModule {}
