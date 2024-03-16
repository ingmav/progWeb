import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ServicioArticuloService } from '../servicio-articulo.service';
import { FormArticulosComponent } from '../form-articulos/form-articulos.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';


@Component({
  selector: 'app-lista-articulos',
  templateUrl: './lista-articulos.component.html',
  styleUrl: './lista-articulos.component.css'
})
export class ListaArticulosComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private servicioArticuloService: ServicioArticuloService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  isLoadingResults:boolean;
  isLoadingPDF:boolean;

  searchQuery:string;

  pageSize:number = 50;
  displayedColumns: string[] = ['descripcion','datos','inventario','ultimo_movimiento'];
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
    // If the user changes the sort order, reset back to the first page.console.log('this.paginator.pageIndex = 0')
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.applySearch();
    });

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

    return this.servicioArticuloService.obtenerLista(params).subscribe({
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


  openDialog(registro?){
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '30%',
      height: '500px',
      disableClose: true,
      data:{}
    };

    if(registro){
      dialogConfig.data.id                 = registro.id;
      dialogConfig.data.descripcion        = registro.descripcion;
      dialogConfig.data.marca              = registro.marca;
      dialogConfig.data.modelo             = registro.modelo;
      dialogConfig.data.talla              = registro.talla;
      //dialogConfig.data.inventario         = registro.inventario;
      dialogConfig.data.max                = registro.max;
      dialogConfig.data.min                = registro.min;
      dialogConfig.data.catalogo_unidad_id = registro.catalogo_unidad_id
    }else
    {
      dialogConfig.data.id = 0;
    }
    console.log(dialogConfig);

    const dialogRef = this.dialog.open(FormArticulosComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.applySearch();
      }
    });
  }

  eliminarArticulo(registro)
  {
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Registro',message:'Esta seguro de eliminar este registro?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        return this.servicioArticuloService.eliminarElemento(registro.id,{}).subscribe({
          next:(response:any) => {
            this.applySearch();
           },
          error:(response:any) => {
            this.alertPanel.showError(response.error.message);
            this.isLoadingResults = false;
          }
        });
      }
    });
    
    
  }
}
