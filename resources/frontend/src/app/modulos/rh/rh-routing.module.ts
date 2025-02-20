import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoContratoComponent } from './contrato/listado-contrato/listado-contrato.component';
import { AuthGuard } from 'src/app/auth/auth.guard';

const routes: Routes = [
  { path: 'recursos-humanos/listado-contrato',             component: ListadoContratoComponent,          canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
