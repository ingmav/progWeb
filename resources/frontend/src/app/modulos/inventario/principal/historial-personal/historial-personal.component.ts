import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MatTable, MatTableModule} from '@angular/material/table';
import { ServicioService } from '../../servicio.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { ReportWorker } from '../../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

export interface DialogData {
  id: number;
}
export interface Articulos {
  id: number;
  articulo: string;
  persona_id: number;
  nombre_persona: string;
  cantidad: number;
}


@Component({
  selector: 'app-historial-personal',
  templateUrl: './historial-personal.component.html',
  styleUrl: './historial-personal.component.css',
  providers:[DatePipe]
})
export class HistorialPersonalComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  isLoading:boolean = false;
  isLoadingResults:boolean;
  isSaving:boolean = false;
  dialogMaxSize:boolean;
  form:FormGroup;
  changesDetected:boolean;
  savedData:boolean;
  filteredCatalogs:any = [];
  filterCatalogs:any = {};
  tipo_Movto:number = 0; 
  filtroFechaStart:String = '';
  articulo:any = { id:0, descripcion:''};
  personal:any = {id:0, descripcion:''};
  validacionIngresos:boolean = false;
  edicionForm:boolean = false;
  indexForm:number = 0;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 7;
  isLoadingPDF:boolean;
  
  displayedColumns: string[] = ['fecha','articulo', 'tipo_movto', 'cantidad'];
  dataSource = [];

  @ViewChild(MatTable) table: MatTable<Articulos>;

  constructor(
    public dialogRef: MatDialogRef<HistorialPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public servicioService:ServicioService
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
    this.form = this.formBuilder.group({
      'trabajador_ingresar':        [''],
    });
    this.dialogRef.addPanelClass('no-padding-dialog');
    
    this.cargarCatalogos();
  }

  printPdf()
  {
    this.isLoadingPDF = true;
    let datos = { trabajador_id: this.form.get('trabajador_ingresar').value.id };
    return this.servicioService.obtenerHistorial(datos).subscribe({
      next:(response:any) => {
        const reportWorker = this.iniciateWorker('INVENTARIO-TRIGUEÑA-HIGIENE');
        let persona = this.form.get("trabajador_ingresar").value;
        reportWorker.postMessage({data:{items: response.data, nombre: persona},reporte:'inventario/personal'});
        this.isLoadingPDF = false;
      },
      error:(response:any) => {
        this.isLoadingPDF = false;
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }

  iniciateWorker(nombre:string)
  {
      const reportWorker = new ReportWorker();
      reportWorker.onmessage().subscribe(
        data => {
          
          FileSaver.saveAs(data.data,nombre);
          reportWorker.terminate();
          //this.isLoadingCardex = false;  
     });

      reportWorker.onerror().subscribe(
        (data) => {
          this.isLoadingPDF = false;
          reportWorker.terminate();
        }
      );
      return reportWorker;
  }

  cargarCatalogos()
  {
    return this.servicioService.obtenerCatalogos({}).subscribe({
      next:(response:any) => {
        this.filterCatalogs.personal = response.personal;
        this.filteredCatalogs['personal'] = this.form.controls['trabajador_ingresar'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'personal','descripcion')));
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
      }
    });
    
  }

  
  private _filter(value: any, catalog: string, valueField: string): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }


  public verHistorial(event?)
  {
    let params:any = {};
    if(!event){
      params.page= 1; 
      params.per_page= this.pageSize;
    }else{
      params.page = event.pageIndex+1;
      params.per_page = event.pageSize;
    }
    params.trabajador_id = this.form.get("trabajador_ingresar").value.id;

    return this.servicioService.obtenerHistorial(params).subscribe({
      next:(response:any) => {
        console.log(response);
        this.dataSource = response.data.data;
        this.resultsLength = response.data.total;
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
      }
    });
    return event;
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
    this.dialogRef.close(this.savedData);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }
}
