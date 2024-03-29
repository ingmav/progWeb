import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PermissionsService } from '../permissions.service';
import { FormComponent } from '../form/form.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private sharedService: SharedService, 
    private permissionsService: PermissionsService, 
    public dialog: MatDialog
  ) { }

  isLoading: boolean = false;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize:number = 50;

  displayedColumns: string[] = ['id','description','group','updated_at'];
  dataSource: any = [];
  
  ngOnInit() {
    this.loadPermissionsData(null);
  }

  public loadPermissionsData(event?:PageEvent){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
      this.pageSize = event.pageSize;
    }

    params.query = this.searchQuery;
    params.show_hidden = true;

    this.dataSource = [];

    this.permissionsService.getPermissionList(params).subscribe({
      next:(response:any) => {
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }else{
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      error:(response:any) =>{
        var errorMessage = "Ocurrió un error.";
        if(response.error){
          errorMessage = response.error.message;
        }
        this.alertPanel.showError(errorMessage);
        this.isLoading = false;
      }
    });
    return event;
  }

  applyFilter(current:boolean = false){
    this.paginator.pageIndex = 0;
    if(current){
      this.loadPermissionsData(this.pageEvent);
    }else{
      this.loadPermissionsData(null);
    }
  }

  openDialogForm(id:string = ''){
    const dialogRef = this.dialog.open(FormComponent, {
      width: '500px',
      autoFocus: false,
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      console.log(this.pageEvent);
      if(reponse){
        this.applyFilter(true);
      }
    });
  }

  confirmDeletePermission(id:string){
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Permiso',message:'Esta seguro de eliminar este permiso?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.permissionsService.deletePermission(id).subscribe(
          response => {
            this.loadPermissionsData(this.pageEvent);
          }
        );
      }
    });
  }

}
