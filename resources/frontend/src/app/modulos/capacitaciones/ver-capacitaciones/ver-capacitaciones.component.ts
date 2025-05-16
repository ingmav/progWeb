import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosService } from '../catalogos.service';

export interface DialogData {
  id: number,
  nombre: string;
}

@Component({
  selector: 'app-ver-capacitaciones',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './ver-capacitaciones.component.html',
  styleUrl: './ver-capacitaciones.component.css'
})
export class VerCapacitacionesComponent {

  empleado: string = "";
  data: any = [];
  pageSize: number = 50;
  displayedColumns: string[] = ['capacitacion', 'estatus'];
  resultsLength = 0;
  isLoadingResults: boolean = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<VerCapacitacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private catalogosService: CatalogosService
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
      });
  }

  destroyed = new Subject<void>();
  dialogMaxSize: boolean;
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  ngOnInit(): void {
    this.empleado = this.inData.nombre;
    this.cargarInfo(this.inData.id);
  }

  cargarInfo(id) {
    return this.catalogosService.Buscar('ver-capacitaciones', this.inData.id, {}).subscribe({
      next: (response: any) => {
        let cargos = response.data.cargo;//.puesto_capacitacion;
        let arreglo: any = [];
        let capacitaciones = [];
        cargos.forEach(element => {
          element.puesto_capacitacion.forEach(element_puesto => {
            //console.log(capacitaciones);
            //console.log((capacitaciones.findIndex(x => x.id == element_puesto.catalogo_capacitacion_id)));
            if (capacitaciones.findIndex(x => x == element_puesto.catalogo_capacitacion_id) == -1) {
              let estructura =
              {
                id: element_puesto.catalogo_capacitacion_id,
                capacitacion: element_puesto.capacitacion.descripcion,
                fecha: "----/--/--",
                estatus: 0
              }
              arreglo.push(estructura);
              capacitaciones.push(element_puesto.catalogo_capacitacion_id);
            }
          });
        });

        let capacitacion_empleado = response.data.capacitaciones;
        //console.log(capacitacion_empleado);
        capacitacion_empleado.forEach(element => {

          let index = arreglo.findIndex(x => x.id == element.catalogo_capacitacion_id);
          //console.log("i->",index);
          arreglo[index].fecha = element.fecha;
          arreglo[index].estatus = 1;
        });
        this.data = arreglo;
      },
      error: (response: any) => {

      }
    });
  }

  resizeDialog() {
    if (!this.dialogMaxSize) {
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    } else {
      this.dialogRef.updateSize('80%', '60%');
      this.dialogMaxSize = false;
    }
  }

  cancelarAccion() {
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close(true);
  }
}
