import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import * as XLSX from 'xlsx';
import { RestService } from '../../../../shared/rest/rest.service'

@Component({
  selector: 'app-lista-asistencia',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lista-asistencia.component.html',
  styleUrl: './lista-asistencia.component.css'
})
export class ListaAsistenciaComponent {
  isLoadingResults: boolean;
  isLoadingPDF: boolean;
  isLoadingCardex: boolean;

  searchQuery: string;

  file_store: FileList;
  file_list: Array<string> = [];

  pageSize: number = 50;
  displayedColumns: string[] = ['empleado', 'asistencia', 'inasistencia', 'ultimo_movimiento'];
  resultsLength = 0;
  data: any;

  constructor(private rest: RestService) { }
  ngOnInit(): void {
    this.data = [];
    this.searchQuery = '';

    setTimeout(() => {
      this.applySearch();
    }, 10);
  }



  onFileSelected(l: FileList, ev): void {
    this.file_store = l;
    if (l.length) {
      const f = l[0];
      const count = l.length > 1 ? `(+${l.length - 1} files)` : "";
      let workBook = null;
      let jsonData = null;
      const reader = new FileReader();
      const file = ev.target.files[0];
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial, name) => {

          const sheet = workBook.Sheets[name];
          initial = XLSX.utils.sheet_to_json(sheet, { raw: false });
          return initial;
        }, {});
        const dataString = JSON.stringify(jsonData);


        if (this.validarFormato(jsonData[0])) {
          this.cargarBase(jsonData);
        } else {
          console.log("no entro");
        }
      }
      reader.readAsBinaryString(file);
    } else {

    }
  }

  validarFormato(data) {
    if (!data['Departamento'] || !data['Empleado'] || !data['Horas trabajadas'] || !data['Salida']) {
      return false;
    }
    return true;
  }

  cargarBase(datos) {
    this.rest.post('importar-asistencia', datos).subscribe({
      next: (response: any) => {

        //this.files.patchValue("");
      },
      error: (response: any) => {
        console.log(response);
      }
    });
  }

  cleanSearch() {
    this.searchQuery = '';
  }

  applySearch() { }
  printPdf() { }
  openDialogHistorial() { }
  openDialogMovto() { }
  VerImagen(x) { }
  openDialogCardex(x) { }
  imprimirCardex(x) { }
}
