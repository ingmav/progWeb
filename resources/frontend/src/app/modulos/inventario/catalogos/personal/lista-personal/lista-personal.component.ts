import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ServicioPersonalService } from '../servicio-personal.service';
import { FormPersonalComponent } from '../form-personal/form-personal.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-lista-personal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lista-personal.component.html',
  styleUrl: './lista-personal.component.css'
})
export class ListaPersonalComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private servicioPersonalService: ServicioPersonalService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  isLoadingResults:boolean;
  
  searchQuery:string;
  isChecked:boolean;

  pageSize:number = 50;
  displayedColumns: string[] = ['nombre', 'cargo','registro'];
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
    console.log(this.isChecked);
    let params:any = {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex+1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
      todos: (this.isChecked == true)? true:false,
    };
    this.isLoadingResults = false;
        
    this.data = [];

    return this.servicioPersonalService.obtenerLista(params).subscribe({
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
      width: '80%',
      height: '50%',
      disableClose: true,
      data:{}
    };

    if(registro){
      dialogConfig.data.id = registro.id;
      dialogConfig.data.descripcion = registro.descripcion;
      dialogConfig.data.cargo = registro.cargo;
    }else{
      dialogConfig.data.id = 0;
    }

    const dialogRef = this.dialog.open(FormPersonalComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
        this.applySearch();
      
    });
  }

  eliminar(registro)
  {
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Registro',message:'Esta seguro de eliminar este registro?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        return this.servicioPersonalService.eliminarElemento(registro.id,{}).subscribe({
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
