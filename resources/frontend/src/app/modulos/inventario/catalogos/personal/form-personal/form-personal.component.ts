import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { ServicioPersonalService } from '../servicio-personal.service'
import { CatalogosService } from 'src/app/modulos/capacitaciones/catalogos.service';

export interface DialogData {
  id: number;
  descripcion: string;
  cargo: any;
}

@Component({
  selector: 'app-form-personal',
  standalone: true,
  imports: [ SharedModule,],
  templateUrl: './form-personal.component.html',
  styleUrl: './form-personal.component.css'
})
export class FormPersonalComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    public dialogRef: MatDialogRef<FormPersonalComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private servicioPersonalService: ServicioPersonalService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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

  isLoading:boolean;
  isSaving:boolean;
  isSendingEmail:boolean;
  dialogMaxSize:boolean;

  isRoot:boolean;

  savedData:boolean;
  filteredCatalogs:any = [];
  filterCatalogs:any = {};
  form:FormGroup;
  configPass:boolean;
  hidePassword:boolean;
  hideConfirmPassword:boolean;
  changesDetected:boolean;
  
  avatarsList: any[];
  selectedAvatar:string;
  avatarRowCount:number;

  statusUser:number;

  lastLogin:any;

  listaGrupos:any[];

  ngOnInit(): void {
    this.savedData = false;
    this.isLoading = false;
    this.dialogRef.addPanelClass('no-padding-dialog');
    
    this.form = this.formBuilder.group({
      'id':                         [''],
      'descripcion':                ['',Validators.required],
      'cargo':                      ['',[Validators.required]],
      
    });
    this.cargarCatalogo();
    
  }

  cargarCatalogo(){

    return this.catalogosService.Listar('puesto',{}).subscribe({
      next:(response:any) => {
        console.log(response);
        this.filterCatalogs.cargo = response.data;
        //this.filteredCatalogs['cargo'] = response.data;
        this.filteredCatalogs['cargo'] = this.form.controls['cargo'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'cargo','descripcion')));

        if(this.inData.id !=0)
        {
          let datos = this.inData;
          let cargo = [];
          if(datos.cargo)
          {
            cargo = datos.cargo.puesto;
            this.form.patchValue({id: datos.id, descripcion: datos.descripcion, cargo:cargo});
          }else{
            this.form.patchValue({id: datos.id, descripcion: datos.descripcion});
          }
          
        }
      },
      error:(response:any) => {
       
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

  guardar(){
    this.alertPanel.closePanel();
    if(this.form.valid ){
      this.isSaving = true;

      let valueForm:any = this.form.value;

      this.servicioPersonalService.crearElemento(valueForm).subscribe({
        next:(response:any)=>{
          this.isSaving = false;
          this.inData.id = response.data.id;
          this.form.get('id').patchValue(response.data.id);
          this.changesDetected = false;
          this.alertPanel.showSuccess('Datos guardados con éxito',3);
          this.dialogRef.close(response);
          this.savedData = true;
        },
        error:(response:any)=>{
          if(response.error.error_type == 'form_validation'){
            for (const key in response.error.data) {
              if (Object.prototype.hasOwnProperty.call(response.error.data, key)) {
                const element = response.error.data[key];
                let error:any = {};
                error[element] = true;
                this.form.get(key).setErrors(error);
              }
            }
            this.alertPanel.showError(response.error.message);
          }else{
            this.alertPanel.showError(response.error.message);
          }
          this.isSaving = false;
        }
      });
    }
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

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }
}
