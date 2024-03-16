import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './principal/lista/lista.component';
import { ListaArticulosComponent } from './catalogos/articulos/lista-articulos/lista-articulos.component';
import { ListaPersonalComponent } from './catalogos/personal/lista-personal/lista-personal.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  { path: 'inventario-higiene',             component: ListaComponent,          canActivate: [AuthGuard] },
  { path: 'inventario-higiene/listado',     component: ListaComponent,          canActivate: [AuthGuard] },
  { path: 'inventario-higiene/articulos',   component: ListaArticulosComponent,  canActivate: [AuthGuard] },
  { path: 'inventario-higiene/personal',    component: ListaPersonalComponent,  canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventarioRoutingModule { }
