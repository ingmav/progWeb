import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from './forms/listado/listado.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  { path: 'actividades',             component: ListadoComponent,          canActivate: [AuthGuard] },
  { path: 'actividades/listado',     component: ListadoComponent,          canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActividadesRoutingModule { }
