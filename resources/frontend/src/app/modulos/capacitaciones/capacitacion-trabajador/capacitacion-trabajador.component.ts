import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { Subject } from 'rxjs';
import { FormCatalogoDialogComponent } from '../form-catalogo-dialog/form-catalogo-dialog.component';
import { CatalogosService } from '../catalogos.service';
import { MatPaginator } from '@angular/material/paginator';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { FormCapacitacionDialogComponent } from '../form-capacitacion-dialog/form-capacitacion-dialog.component';


@Component({
  selector: 'app-capacitacion-trabajador',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './capacitacion-trabajador.component.html',
  styleUrl: './capacitacion-trabajador.component.css'
})
export class CapacitacionTrabajadorComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  dialogMaxSize:boolean;
  changesDetected:boolean;
  isLoading:boolean;
  data:any = [];
  pageSize:number = 50;
  displayedColumns: string[] = ['descripcion', 'norma','ultimo_movimiento'];
  resultsLength = 0;
  isLoadingResults:boolean = false;
  searchQuery:string;
  categorias:any = [
    {id:0, descripcion:""},
    {id:1, descripcion:"SEGURIDAD E HIGIENE"},
    {id:2, descripcion:"CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD LABORAL"},
    {id:3, descripcion:"PROTECCIÓN CIVIL"},
    {id:4, descripcion:"SIMULACROS"},
    {id:5, descripcion:"MEDIO AMBIENTE"},
  ]

  constructor(
    public dialogRef: MatDialogRef<CapacitacionTrabajadorComponent>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private catalogosService:CatalogosService
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
    this.searchQuery = '';
    setTimeout(() => {
      this.applySearch();
    }, 10);
  }

  ngAfterViewInit(){
    
    this.paginator.page.subscribe(()=>{
      if(this.pageSize != this.paginator.pageSize){
        this.paginator.pageIndex = 0;
        this.pageSize = this.paginator.pageSize;
      }
      this.applySearch();
    });
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  applySearch(){

    this.isLoadingResults = true;
    let params:any = {
      page: this.paginator.pageIndex+1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
    };
    this.isLoadingResults = false;
        
    this.data = [];

    return this.catalogosService.Listar('capacitacion',params).subscribe({
      next:(response:any) => {
        this.isLoadingResults = false;
        this.resultsLength = response.data.total;
        this.data = response.data.data;
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }

  AddCapacitacion()
  {
    let dialogConfig:any = {
      width: '50%',
      height: '200px',
      disableClose: true,
      data: { api:'capacitacion', titulo:'CAPACITACIONES', accion:"NUEVO" }
    };
    
    const dialogRef = this.dialog.open(FormCapacitacionDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        this.applySearch();
      
    });
  }

  editar(obj)
  {
    let dialogConfig:any = {
      width: '50%',
      height: '200px',
      disableClose: true,
      data: { api:'capacitacion', titulo:'CAPACITACIONES', accion:"EDITAR", form:obj}
    };
    
    const dialogRef = this.dialog.open(FormCapacitacionDialogComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        this.applySearch();
      
    });
  }

  eliminar(id)
  {
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Registro',message:'Esta seguro de eliminar este registro?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.catalogosService.Eliminar('capacitacion',id,{}).subscribe(
          response => {
            this.applySearch();
          }
        );
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
    this.dialogRef.close(true);
  }
}
