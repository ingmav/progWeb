import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-listado-contrato',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listado-contrato.component.html',
  styleUrl: './listado-contrato.component.css'
})
export class ListadoContratoComponent {

  isLoadingResults:boolean;
  isLoadingPDF:boolean;
  isLoadingCardex:boolean;

  searchQuery:string;

  pageSize:number = 50;
  displayedColumns: string[] = ['descripcion','datos','inventario','imagen','ultimo_movimiento'];
  resultsLength = 0;
  data:any;

  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
  }
  
  cleanSearch(){
    this.searchQuery = '';
  }

  applySearch(){}
  printPdf(){}
  openDialogHistorial(){}
  openDialogMovto(){}
  VerImagen(x){}
  openDialogCardex(x){}
  imprimirCardex(x){}
}
