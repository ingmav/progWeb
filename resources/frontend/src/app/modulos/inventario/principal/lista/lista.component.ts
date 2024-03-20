import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ServicioService } from '../../servicio.service';
import { MovimientoComponent } from '../movimiento/movimiento.component';
import { CardexComponent } from '../cardex/cardex.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private servicioService: ServicioService,
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

    return this.servicioService.obtenerLista(params).subscribe({
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


  openDialogMovto(id?){
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '100%',
      height: '1000%',
      disableClose: true,
      data:{}
    };

    if(id){
      dialogConfig.data.id = id;
    }

    const dialogRef = this.dialog.open(MovimientoComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applySearch();
      }
    });

  }
  openDialogCardex(obj?){
    console.log(obj);
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      disableClose: true,
      data:{ 
        id:obj.id,
        descripcion:obj.descripcion,
        marca:obj.marca,
        modelo:obj.modelo,
        talla:obj.talla,
        inventario:obj.inventario,
        max:obj.max,
        min:obj.min
      }
    };

    const dialogRef = this.dialog.open(CardexComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applySearch();
      }
    });

  }
}
