import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosService } from '../catalogos.service';

export interface DialogData {
  form:any
}


@Component({
  selector: 'app-puesto-capacitacion',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './puesto-capacitacion.component.html',
  styleUrl: './puesto-capacitacion.component.css'
})
export class PuestoCapacitacionComponent {
   
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  dialogMaxSize:boolean;
  changesDetected:boolean;
  isLoading:boolean = false;
  puesto:string;
  seleccionados:any = [];
  no_seleccionados:any = [];
  capacitaciones:any = [];
  borrador_no_seleccionado:any = [];
  borrador_seleccionado:any = [];
  isSaving:boolean = false;

  constructor(
    public dialogRef:  MatDialogRef<PuestoCapacitacionComponent>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private catalogosService:CatalogosService
    //private catalogosService:CatalogosService
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
  currentScreenSize: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  ngOnInit(): void {
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.puesto = this.inData.form.descripcion;
    
    this.CargarListas();
  }

  CargarListas()
  {
    this.catalogosService.CargarCapacitaciones().subscribe(
      response => {
        
        this.capacitaciones =response.data;
        this.CapacitacionesPuesto();
      }
    );
  }

  CapacitacionesPuesto()
  {
    this.catalogosService.Buscar('puesto', this.inData.form.id,{}).subscribe(
      response => {
        this.CargarCapacitaciones(response.data.capacitaciones);
      }
    );
  }

  CargarCapacitaciones(listado)
  {
    this.capacitaciones.forEach(element => {
      let item = listado.find(x =>x.catalogo_capacitacion_id == element.id);
      if(item)
      {
        this.seleccionados.push({id: element.id, descripcion:element.descripcion});
      }else{
        this.no_seleccionados.push({id: element.id, descripcion:element.descripcion});
      }
    });
  }

  der()
  {
    this.borrador_no_seleccionado.forEach(element => {
      this.seleccionados.push(element);
    });

    this.borrador_no_seleccionado.forEach(element => {
      let index = this.no_seleccionados.findIndex(x=> x.id == element.id);
      this.no_seleccionados.splice(index, 1);
    });
    this.borrador_no_seleccionado = [];
  }
  
  izq()
  {
    this.borrador_seleccionado.forEach(element => {
      this.no_seleccionados.push(element);
    });

    this.borrador_seleccionado.forEach(element => {
      let index = this.seleccionados.findIndex(x=> x.id == element.id);
      this.seleccionados.splice(index, 1);
    });
    this.borrador_seleccionado = [];
  }

  seleccionarCapacitacion(obj)
  {
    let buscar = this.borrador_no_seleccionado.findIndex(x => x.id == obj.id);
    if(buscar != -1)
    {
      this.borrador_no_seleccionado.splice(buscar, 1);
    }else{
      this.borrador_no_seleccionado.push(obj);
    }
  }

  guardar()
  {
    this.isLoading = true;
    this.catalogosService.guardarPuestoCapacitacion(this.inData.form.id, this.seleccionados).subscribe(
      response => {
       this.cancelarAccion();

      },error=>
        {
          this.isLoading = false;
        }
    );
  }
  
  seleccionarNoCapacitacion(obj)
  {
    let buscar = this.borrador_seleccionado.findIndex(x => x.id == obj.id);
    if(buscar != -1)
    {
      this.borrador_seleccionado.splice(buscar, 1);
    }else{
      this.borrador_seleccionado.push(obj);
    }
    
  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','60%');
      this.dialogMaxSize = false;
    }
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(true);
  }
}
