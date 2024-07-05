import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MatTable} from '@angular/material/table';
import { ServicioService } from '../../servicio.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { ReportWorker } from '../../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';

export interface DialogData {
  id: number;
  descripcion:string;
  marca:string;
  modelo:string,
  talla:string;
  inventario:any;
  max:any;
  min:any;
  extension:string;
}

@Component({
  selector: 'app-cardex',
  templateUrl: './cardex.component.html',
  styleUrl: './cardex.component.css'
})
export class CardexComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoading:boolean = false;
  isSaving:boolean = false;
  dialogMaxSize:boolean;
  isLoadingResults:boolean;
  preview:string;
  
  displayedColumns: string[] = ['tipo','cantidad','persona','fecha'];
  data:any;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 7;
  loadingCardex:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CardexComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.cargarCardex(null);
    if(this.inData.extension!= null)
    {
      this.cargarImagen();
    }
    
  }

  cargarImagen()
  {
    this.servicioService.verImagen({id: this.inData.id}).subscribe({
      next:(response:any)=>{
        if(response.image!='')
        {
          this.preview = "data:image/png;base64,"+response.image;
        }
      },
      error:(response:any)=>{
        if(response.error.error_type == 'form_validation'){
          for (const key in response.error.data) {
            if (Object.prototype.hasOwnProperty.call(response.error.data, key)) {
              const element = response.error.data[key];
              let error:any = {};
              error[element] = true;
            }
          }
          this.alertPanel.showError(response.error.message);
        }else{
          this.alertPanel.showError(response.error.message);
        }
        this.isSaving = false;
      }
    });
  }

  cargarCardex(event?)
  {
    let params:any = {};
    if(!event){
      params.page= 1; 
      params.per_page= this.pageSize;
    }else{
      params.page = event.pageIndex+1;
      params.per_page = event.pageSize;
    }
    return this.servicioService.obtenerCardex(this.inData.id,params).subscribe({
      next:(response:any) => {
       //console.log(response);
        this.data = response.cardex.data;
       this.resultsLength = response.cardex.total;
          
       console.log(response); 
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
      }
    });
    return event;
  }

  imprimirCardex(obj)
  {
    this.loadingCardex = true;
    return this.servicioService.obtenerCardex(this.inData.id,{}).subscribe({
      next:(response:any) => {
       //console.log(response);
       const reportWorker = this.iniciateWorker('CARDEX');
        let config = {  title: "hola", lote:true, externo:true };
        reportWorker.postMessage({data: { items: response.cardex, articulo: response.articulo },reporte:'inventario/cardex'});
        //this.isLoadingPDF = false;  
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
        this.loadingCardex = false;
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
          this.loadingCardex = false;
     });

      reportWorker.onerror().subscribe(
        (data) => {
          //this.isLoadingPDF = false;
          reportWorker.terminate();
          this.loadingCardex = false;
        }
      );
      return reportWorker;
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
    this.dialogRef.close(false);
  }

}
