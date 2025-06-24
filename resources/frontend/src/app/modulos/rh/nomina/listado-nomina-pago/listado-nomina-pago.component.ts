import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { AuthService } from 'src/app/auth/auth.service';

import { ReportWorker } from '../../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import { RestService } from 'src/app/shared/rest/rest.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormConceptosComponent } from '../form-conceptos/form-conceptos.component';


@Component({
  selector: 'app-listado-nomina-pago',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listado-nomina-pago.component.html',
  styleUrl: './listado-nomina-pago.component.css'
})
export class ListadoNominaPagoComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private restService: RestService,
    private authService: AuthService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) { }

  isLoadingResults: boolean;
  isLoadingCardex: boolean;

  searchQuery: string;

  pageSize: number = 50;
  displayedColumns: string[] = ['empleado', 'perceociones', 'deducciones', 'liquido'];
  resultsLength = 0;
  data: any;
  id: number = 0;

  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.applySearch();
    });

    this.paginator.page.subscribe(() => {
      if (this.pageSize != this.paginator.pageSize) {
        this.paginator.pageIndex = 0;
        this.pageSize = this.paginator.pageSize;
      }
      this.applySearch();
    });
  }

  cleanSearch() {
    this.searchQuery = '';
  }

  applySearch() {
    this.isLoadingResults = true;
    let params: any = {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex + 1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
      catalogo_nomina_id: this.route.snapshot.paramMap.get('id')
    };
    this.isLoadingResults = false;

    this.data = [];

    return this.restService.get('nomina-pago', params).subscribe({
      next: (response: any) => {
        this.isLoadingResults = false;
        this.resultsLength = response.data.total;
        this.data = response.data.data;

      },
      error: (response: any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }

  conceptos(obj?)
  {
    let dialogConfig: any = {
      width: '60%',
      height: '60%',
      disableClose: true,
      data: {}
    };

    if (obj) {
      dialogConfig.data.obj = obj;
    }

    const dialogRef = this.dialog.open(FormConceptosComponent,dialogConfig);
 
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applySearch();
      }
    });
  }

}
