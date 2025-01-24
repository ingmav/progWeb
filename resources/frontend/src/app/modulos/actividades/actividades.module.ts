import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadesRoutingModule } from './actividades-routing.module';
import { ListadoComponent } from './forms/listado/listado.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ListadoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ActividadesRoutingModule
  ]
})
export class ActividadesModule { }
