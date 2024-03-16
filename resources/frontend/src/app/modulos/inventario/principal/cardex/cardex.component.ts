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

export interface DialogData {
  id: number;
  descripcion:string;
  marca:string;
  modelo:string,
  talla:string;
  inventario:any;
  max:any;
  min:any
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
  
  displayedColumns: string[] = ['tipo','cantidad','persona','fecha'];
  data:any;

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
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
  }

  cargarCardex(event?)
  {
    let params:any = {};

    //console.log(this.filtro);

    
    if(!event){
      params.page= 1; 
      params.per_page= this.pageSize;
    }else{
      params.page = event.pageIndex+1;
      params.per_page = event.pageSize;
    }
    return this.servicioService.obtenerCardex(this.inData.id,params).subscribe({
      next:(response:any) => {
       this.data = response.cardex.data;
       this.resultsLength = response.cardex.total;
          
       console.log(response); 
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
      }
    });
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
