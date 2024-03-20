import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from './inventario-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaComponent } from './principal/lista/lista.component';
import { ListaArticulosComponent } from './catalogos/articulos/lista-articulos/lista-articulos.component';
import { ListaPersonalComponent } from './catalogos/personal/lista-personal/lista-personal.component';
import { MovimientoComponent } from './principal/movimiento/movimiento.component';
import { CardexComponent } from './principal/cardex/cardex.component';



@NgModule({
  declarations: [
    ListaComponent,
    ListaArticulosComponent,
    ListaPersonalComponent,
    MovimientoComponent,
    CardexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    InventarioRoutingModule,
    
  ]
})
export class InventarioModule { }
