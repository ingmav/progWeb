import { ListadoPersonalComponent } from './listado-personal/listado-personal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CapacitacionesRoutingModule } from './capacitaciones-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ ListadoPersonalComponent],
  imports: [
    CommonModule,
    SharedModule,
    CapacitacionesRoutingModule
  ]
})
export class CapacitacionesModule { }
