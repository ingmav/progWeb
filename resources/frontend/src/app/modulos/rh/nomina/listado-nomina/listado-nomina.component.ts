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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-nomina',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './listado-nomina.component.html',
  styleUrl: './listado-nomina.component.css'
})
export class ListadoNominaComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    private restService: RestService,
    private authService: AuthService,
    public dialog: MatDialog,
  ) { }

  isLoadingResults: boolean;
  isLoadingPDF: boolean;
  isLoadingCardex: boolean;

  searchQuery: string;

  pageSize: number = 50;
  displayedColumns: string[] = ['nomina', 'periodo', 'trabajadores', 'monto_total'];
  resultsLength = 0;
  data: any;

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

  VerImagen(registro?) {
    let dialogConfig: any = {
      maxWidth: '100%',
      disableClose: true,
      data: { id: registro.id }
    };

    /*const dialogRef = this.dialog.open(VerImagenComponent,dialogConfig);
 
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if(result){
        this.applySearch();
      }
    });*/
  }

  applySearch() {
    this.isLoadingResults = true;
    let params: any = {
      sort: this.sort.active,
      direction: this.sort.direction,
      page: this.paginator.pageIndex + 1,
      per_page: this.paginator.pageSize,
      query: this.searchQuery,
    };
    this.isLoadingResults = false;

    this.data = [];

    return this.restService.get('nomina',params).subscribe({
      next:(response:any) => {
        this.isLoadingResults = false;
        this.resultsLength = response.data.total;
        let index = 0;
        response.data.data.forEach(element => {
          
          let subtotal = 0;
          element.pagos.forEach(elementPago => {
            subtotal += parseFloat(elementPago.total_neto);
          });
          response.data.data[index].monto_nominal = subtotal;
          index++;
        });
        
        this.data = response.data.data;

      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }


  openDialogMovto(id?) {
    let dialogConfig: any = {
      maxWidth: '100%',
      width: '100%',
      height: '100%',
      disableClose: true,
      data: {}
    };

    if (id) {
      dialogConfig.data.id = id;
    }

    /*const dialogRef = this.dialog.open(MovimientoComponent,dialogConfig);
 
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applySearch();
      }
    });*/

  }
  openDialogHistorial(id?) {
    let dialogConfig: any = {
      maxWidth: '100%',
      width: '100%',
      height: '1000%',
      disableClose: true,
      data: {}
    };

    if (id) {
      dialogConfig.data.id = id;
    }

    /*const dialogRef = this.dialog.open(HistorialPersonalComponent,dialogConfig);
 
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.applySearch();
      }
    });*/

  }


  printPdf() {
    this.isLoadingPDF = true;
    /*return this.servicioService.obtenerLista(null).subscribe({
      next:(response:any) => {
        const reportWorker = this.iniciateWorker('INVENTARIO-TRIGUEÑA-HIGIENE');
        let config = {  title: "hola", lote:true, externo:true };
        reportWorker.postMessage({data:{items: response.data},reporte:'inventario/general'});
        this.isLoadingPDF = false;
      },
      error:(response:any) => {
        this.isLoadingPDF = false;
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });*/
  }

  imprimirCardex(obj) {
    this.isLoadingCardex = true;
    /*return this.servicioService.obtenerCardex(obj.id,{}).subscribe({
      next:(response:any) => {
       //console.log(response);
       const reportWorker = this.iniciateWorker('CARDEX');
        let config = {  title: "hola", lote:true, externo:true };
        reportWorker.postMessage({data: { items: response.cardex, articulo: response.articulo },reporte:'inventario/cardex'});
        this.isLoadingCardex = false;  
      },
      error:(response:any) => {
        this.isLoadingCardex = false; 
        this.alertPanel.showError(response.error.message);
      }
    });*/
  }

  iniciateWorker(nombre: string) {
    const reportWorker = new ReportWorker();
    reportWorker.onmessage().subscribe(
      data => {

        FileSaver.saveAs(data.data, nombre);
        reportWorker.terminate();
        this.isLoadingCardex = false;
      });

    reportWorker.onerror().subscribe(
      (data) => {
        this.isLoadingPDF = false;
        reportWorker.terminate();
      }
    );
    return reportWorker;
  }

}
