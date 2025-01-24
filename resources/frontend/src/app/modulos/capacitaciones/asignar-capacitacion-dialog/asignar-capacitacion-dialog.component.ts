import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, map, startWith, takeUntil } from 'rxjs';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosService } from '../catalogos.service';
import { MatTable } from '@angular/material/table';
import { formatDate } from '@angular/common';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';

export interface Capacitacion {
  index:number;
  fecha:string;
  empleado:any;
  capacitacion:any;  
}

const format = 'yyyy-MM-dd';
  //const myDate = '2019-06-29';
const locale = 'en-ES';

@Component({
  selector: 'app-asignar-capacitacion-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './asignar-capacitacion-dialog.component.html',
  styleUrl: './asignar-capacitacion-dialog.component.css'
})
export class AsignarCapacitacionDialogComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(MatTable) table: MatTable<Capacitacion>;

  
  

  dialogMaxSize:boolean;
  changesDetected:boolean;
  isLoading:boolean = false;
  data:any = [];
  pageSize:number = 50;
  displayedColumns: string[] = ['empleado','fecha','capacitacion'];
  resultsLength = 0;
  isLoadingResults:boolean = false;

  isSaving:boolean;
  form:FormGroup;
  filteredCatalogs:any = { };
  filterCatalogs:any = {};
  

  constructor(
    public dialogRef: MatDialogRef<AsignarCapacitacionDialogComponent>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private catalogosService:CatalogosService
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

  ngOnInit(): void {
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.form = this.formBuilder.group({
      'id':                         ['-1'],
      'fecha':                      ['',Validators.required],
      'catalogo_capacitacion_id':   ['',Validators.required],
      'catalogo_personal_id':       ['',Validators.required],
      
    });
    this.cargarCatalogos();
  }

  cargarCatalogos()
  {
    return this.catalogosService.Listar('capacitacion',{}).subscribe({
      next:(response:any) => {
        this.filterCatalogs.capacitacion = response.data;
        
        this.filteredCatalogs['capacitacion'] = this.form.controls['catalogo_capacitacion_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'capacitacion','descripcion')));
      },
      error:(response:any) => {
        this.isLoading = false; 
        this.alertPanel.showError(response.error.message);
      }
    });
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  cargaPersonal(obj){
    this.form.patchValue({catalogo_personal_id:''});
    return this.catalogosService.Buscar('rel-personal-capacitacion',obj.source.value.id ,{}).subscribe({
      next:(response:any) => {
        this.filterCatalogs.personal = response.data;
        this.filteredCatalogs['personal'] = this.form.controls['catalogo_personal_id'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'personal','descripcion')));
      },
      error:(response:any) => {
        this.isLoading = false; 
        this.alertPanel.showError(response.error.message);
      }
    });
  }

  insertaCapacitacion()
  {
      let datos = this.form.value;
      if(datos.id == '-1')
      {
        this.data.push(datos);  
      }else{
        this.data[this.form.get('id').value] = this.form.value;
        this.form.patchValue({id:'-1'});
      }
      
      this.table.renderRows();
      this.form.patchValue({catalogo_personal_id:''});
  }

  edita(obj, index){
    obj.id = index;
    this.form.patchValue(obj);
    
  }

  elimina(index){
    console.log();
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Registro',message:'¿Esta seguro de eliminar este registro?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.data.splice(index,1);
        this.table.renderRows();
      }
    });
  }
  guardar(){
    this.isLoading = true;
    return this.catalogosService.Guardar('rel-empleado-capacitacion', { listado: this.data}).subscribe({
      next:(response:any) => {
        this.cerrar();
      },
      error:(response:any) => {
        this.isLoading = false; 
        this.alertPanel.showError(response.error.message);
      }
    });
  }

  resizeDialog(){
    if(!this.dialogMaxSize){
      this.dialogRef.updateSize('100%', '100%');
      this.dialogMaxSize = true;
    }else{
      this.dialogRef.updateSize('80%','60%');
      this.dialogMaxSize = false;
    }
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(true);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }
}
