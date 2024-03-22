import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { Observable } from 'rxjs';
//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { ServicioArticuloService } from '../servicio-articulo.service';


export interface DialogData {
  id: number;
  descripcion: string;
  marca: string;
  modelo: string;
  talla: string;
  catalogo_unidad_id: number;
  //inventario: number;
  min: number;
  max: number;
  extension: string;
}

@Component({
  selector: 'app-form-articulos',
  standalone: true,
  imports: [ SharedModule],
  templateUrl: './form-articulos.component.html',
  styleUrl: './form-articulos.component.css'
})
export class FormArticulosComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  constructor(
    public dialogRef: MatDialogRef<FormArticulosComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private servicioArticuloService: ServicioArticuloService,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
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
  dialogMaxSize:boolean;
  changesDetected:boolean = false;

  savedData:boolean;

  form:FormGroup;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';

  imageInfos?: Observable<any>;
  
  unidades:any[];
  
  ngOnInit(): void {
    this.savedData = false;
    this.isLoading = false;
    this.dialogRef.addPanelClass('no-padding-dialog');
    
    this.cargarCatalogo();
    this.form = this.formBuilder.group({
      'id':                 [''],
      'descripcion':        ['',Validators.required],
      'catalogo_unidad_id': ['',[Validators.required]],
      'marca':              ['',[Validators.required]],
      'modelo':             ['',[Validators.required]],
      'talla':             ['',[Validators.required]],
      //'inventario':             ['',[Validators.required, Validators.min(0)]],
      'min':             ['',[Validators.required]],
      'max':             ['',[Validators.required]],
      
    });
console.log(this.inData.extension);
    if(this.inData.extension != null)
    {
      this.cargarImagen();
    }
  }

  cargarImagen()
  {
    this.servicioArticuloService.verImagen({id: this.inData.id}).subscribe({
      next:(response:any)=>{
        console.log(response);
        this.preview = "data:image/png;base64,"+response.image;
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

  cargarCatalogo()
  {
    this.servicioArticuloService.CatalogoUnidad().subscribe({
      next:(response:any)=>{
        this.unidades = response.data;
          let datos = this.inData;
          this.form.patchValue({id: datos.id, descripcion: datos.descripcion, marca:datos.marca, modelo:datos.modelo, talla:datos.talla, max:datos.max, min:datos.min, catalogo_unidad_id:datos.catalogo_unidad_id});
        
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

  guardar(){
    this.alertPanel.closePanel();
    if(this.form.valid ){
      this.isSaving = true;

      let valueForm:any = this.form.value;

      this.servicioArticuloService.crearElemento(valueForm).subscribe({
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

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }

  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.preview = '';
        this.currentFile = file;
  
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.preview = e.target.result;
        };
        console.log(this.preview);
        reader.readAsDataURL(this.currentFile);
      }
    }
  }

  upload(): void {
    this.progress = 0;
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.currentFile = file;
        let data = {'articulo_id': this.inData.id};
        this.servicioArticuloService.SubirImagen(data,file).subscribe({
          next:(response:any)=>{
           
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
  
      this.selectedFiles = undefined;
    }
  }
}
