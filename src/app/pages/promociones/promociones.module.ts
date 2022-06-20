import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PromocionesPageRoutingModule } from './promociones-routing.module';
import { PromocionesPage } from './promociones.page';
import { PromocionEditPage } from '../promocion-edit/promocion-edit.page';

import { ReactiveFormsModule } from '@angular/forms';
import { PromocionEditPageModule } from '../promocion-edit/promocion-edit.module';

@NgModule({
  entryComponents: [
    PromocionEditPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PromocionesPageRoutingModule,
    ReactiveFormsModule,
    PromocionEditPageModule
  ],
  declarations: [PromocionesPage]
})
export class PromocionesPageModule {}
