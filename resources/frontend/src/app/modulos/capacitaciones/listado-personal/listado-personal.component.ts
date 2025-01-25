import { CatalogosService } from './../catalogos.service';
import { Component, ViewChild, viewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { PuestosComponent } from '../puestos/puestos.component';
import { CapacitacionTrabajadorComponent } from '../capacitacion-trabajador/capacitacion-trabajador.component';
import { PuestoCapacitacionComponent } from '../puesto-capacitacion/puesto-capacitacion.component';
import { ListaPersonalComponent } from '../../inventario/catalogos/personal/lista-personal/lista-personal.component';
import { TrabajadorComponent } from '../trabajador/trabajador.component';
import { AsignarCapacitacionDialogComponent } from '../asignar-capacitacion-dialog/asignar-capacitacion-dialog.component';
import { VerCapacitacionesComponent } from '../ver-capacitaciones/ver-capacitaciones.component';

@Component({
  selector: 'app-listado-personal',
  templateUrl: './listado-personal.component.html',
  styleUrl: './listado-personal.component.css'
})
export class ListadoPersonalComponent {

  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
    @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  
    constructor(
      private authService: AuthService,
      public dialog: MatDialog,
      private catalogosService:CatalogosService
    ) { }
  
    isLoadingResults:boolean;
    isLoadingPDF:boolean;
    isLoadingCardex:boolean;
  
    searchQuery:string;
  
    pageSize:number = 50;
    displayedColumns: string[] = ['empleado','capacitaciones','porcentaje','ultimo_movimiento'];
    resultsLength = 0;
    data:any;
  
    ngOnInit(): void {
      this.data = [];
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
        sort: this.sort.active,
        direction: this.sort.direction,
        page: this.paginator.pageIndex+1,
        per_page: this.paginator.pageSize,
        query: this.searchQuery,
      };
      this.isLoadingResults = false;
          
      this.data = [];
  
      return this.catalogosService.Listar('personal-capacitacion',params).subscribe({
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

    
    openDialogCapacitaciones(obj){
      console.log(obj);
      let dialogConfig:any = {
        width: '80%',
        height: '80%',
        disableClose: true,
        data: { id: obj.id, nombre: obj.descripcion }
      };
      
      const dialogRef = this.dialog.open(VerCapacitacionesComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.applySearch();
        }
      });
    }
    imprimirCardex(obj){}

    asignarCapacitacion()
    {
      let dialogConfig:any = {
        width: '80%',
        height: '80%',
        disableClose: true
      };
      
      const dialogRef = this.dialog.open(AsignarCapacitacionDialogComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.applySearch();
        }
      });
    }

    listadoPuesto(){
      let dialogConfig:any = {
        width: '80%',
        height: '80%',
        disableClose: true
      };
      
      const dialogRef = this.dialog.open(PuestosComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.applySearch();
        }
      });
    }

    listadoTrabajador(){
      let dialogConfig:any = {
        width: '80%',
        height: '80%',
        disableClose: true
      };
      
      const dialogRef = this.dialog.open(TrabajadorComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.applySearch();
        }
      });
    }
    
    listadoCapacitacion(){
      let dialogConfig:any = {
        width: '80%',
        height: '80%',
        disableClose: true
      };
      
      const dialogRef = this.dialog.open(CapacitacionTrabajadorComponent,dialogConfig);
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.applySearch();
        }
      });
    }
}
