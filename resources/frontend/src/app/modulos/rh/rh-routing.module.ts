import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoContratoComponent } from './contrato/listado-contrato/listado-contrato.component';
import { AuthGuard } from 'src/app/auth/auth.guard';
import { ListaAsistenciaComponent } from './asistencia/lista-asistencia/lista-asistencia.component';
import { ListadoNominaComponent } from './nomina/listado-nomina/listado-nomina.component';

const routes: Routes = [
  { path: 'recursos-humanos/listado-contrato',             component: ListadoContratoComponent,          canActivate: [AuthGuard] },
  { path: 'recursos-humanos/asistencia',             component: ListaAsistenciaComponent,          canActivate: [AuthGuard] },
  { path: 'recursos-humanos/nomina',             component: ListadoNominaComponent,          canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
