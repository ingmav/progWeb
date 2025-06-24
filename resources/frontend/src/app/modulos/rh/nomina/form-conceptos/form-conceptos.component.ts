import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { findIndex, map, startWith, Subject, takeUntil } from 'rxjs';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { RestService } from 'src/app/shared/rest/rest.service';
import { SharedModule } from 'src/app/shared/shared.module';


export interface DialogData {
  obj: any;
}

@Component({
  selector: 'app-form-conceptos',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form-conceptos.component.html',
  styleUrl: './form-conceptos.component.css'
})
export class FormConceptosComponent {

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(MatTable) table: MatTable<any>;

  action_form: string = "";
  constructor(
    public dialogRef: MatDialogRef<FormConceptosComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public restService: RestService
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

  isLoading: boolean;
  isSaving: boolean;
  dialogMaxSize: boolean;

  savedData: boolean;
  filteredCatalogs: any = [];
  filterCatalogs: any = {};
  form: FormGroup;

  displayedColumns: string[] = ['concepto', 'unidades', 'monto'];
  pageSize: number = 50;
  resultsLength = 0;

  data: any[];
  isLoadingResults: boolean = false;

  edicion_personal: boolean = false;

  totales: any = { cantidad: 0, percepciones: 0, deducciones: 0, liquido: 0 };

  ngOnInit(): void {
    this.savedData = false;
    this.isLoading = false;
    this.dialogRef.addPanelClass('no-padding-dialog');

    this.form = this.formBuilder.group({
      'id': [''],
      'catalogo_personal_id': ['', Validators.required],
      'catalogo_conceptos_id': ['', Validators.required],
      'unidades': [''],
      'monto': ['', Validators.required],

    });

    this.cargarCatalogos();


  }

  cargarCatalogos() {
    let datos = ['personal', 'conceptos'];
    return this.restService.get('catalogos-nomina', datos).subscribe({
      next: (response: any) => {
        let conceptos = response.data.conceptos;
        this.filterCatalogs.personal = response.data.personal;
        this.filterCatalogs.conceptos = conceptos;

        if (this.inData.obj) {
          this.form.patchValue({ catalogo_personal_id: this.inData.obj.personal });
          this.edicion_personal = true;
          this.data = this.inData.obj.pagos_detalles;
          this.calculaTotales();

        } else {
          this.filteredCatalogs['personal'] = this.form.controls['catalogo_personal_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'personal', 'descripcion')));
        }
        this.filteredCatalogs['concepto'] = this.form.controls['catalogo_conceptos_id'].valueChanges.pipe(startWith(''), map(value => this._filter(value, 'conceptos', 'descripcion')));
      },
      error: (response: any) => {
        this.alertPanel.showError(response.error.message);
        this.isLoadingResults = false;
      }
    });
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    let filterValue = '';
    if (value) {
      if (typeof (value) == 'object') {
        filterValue = value[valueField].toLowerCase();
      } else {
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  agregar_concepto() {
    let obj: any = {
      catalogo_concepto_id: this.form.get('catalogo_conceptos_id').value.id,
      conceptos: this.form.get('catalogo_conceptos_id').value,
      importe_unitario: this.form.get('monto').value,
      subtotal: this.form.get('monto').value,
      unidades: this.form.get('unidades').value
    }

    let validacion = this.data.findIndex(x => x.catalogo_conceptos_id == this.form.get('catalogo_conceptos_id').value.id)
    if (validacion != -1) {
      const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
        width: '500px',
        data: { title: 'Advertencia', message: 'Esta seguro de registrar este concepto? (Ya se encuentra entre sus conceptos)', hasOKBtn: true, btnColor: 'warn', btnText: 'Agregar', btnIcon: 'check' }
      });

      dialogRef.afterClosed().subscribe(reponse => {
        if (reponse) {
          this.data.push(obj);
          this.table.renderRows();
          this.calculaTotales();
        }
      });
    } else {
      this.data.push(obj);
      this.table.renderRows();
      this.calculaTotales();
    }

    this.form.reset();
    this.form.patchValue({ catalogo_personal_id: this.inData.obj.personal });
  }

  edicion_concepto(obj) { }
  elimina_concepto(obj, index?) {
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: { title: 'Eliminar', message: 'Esta seguro de eliminar este registro?', hasOKBtn: true, btnColor: 'warn', btnText: 'Eliminar', btnIcon: 'delete' }
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if (reponse) {
        this.data.splice(index, 1);
        this.table.renderRows();
        this.calculaTotales();
      }
    });
  }

  calculaTotales() {
    this.totales = { cantidad: 0, percepciones: 0, deducciones: 0, liquido: 0 };

    this.data.forEach(element => {
      if (element.conceptos.tipo == 1) {
        this.totales.percepciones += parseFloat(element.subtotal);
      } else {
        this.totales.deducciones += parseFloat(element.subtotal);
      }
      this.totales.liquido = this.totales.percepciones - this.totales.deducciones;
      this.totales.cantidad++;
    });
  }

  resizeDialog() {
    if (!this.dialogMaxSize) {
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    } else {
      this.dialogRef.updateSize('80%', '60%');
      this.dialogMaxSize = false;
    }
  }

  getDisplayFn(label: string) {
    return (val) => this.displayFn(val, label);
  }

  displayFn(value: any, valueLabel: string) {
    return value ? value[valueLabel] : value;
  }

  cancelarAccion() {
    this.cerrar();
  }

  cerrar() {
    this.dialogRef.close(this.savedData);
  }
}
