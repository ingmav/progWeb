import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { ImageCroppedEvent, ImageCropperComponent }  from 'ngx-image-cropper';

//Para checar tamaño de la pantalla
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { CustomValidator } from 'src/app/utils/classes/custom-validator';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { ServicioArticuloService } from '../servicio-articulo.service';
import { ImageCropperModule } from 'ngx-image-cropper';

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
}

@Component({
  selector: 'app-form-articulos',
  standalone: true,
  imports: [ SharedModule, ImageCropperModule],
  templateUrl: './form-articulos.component.html',
  styleUrl: './form-articulos.component.css'
})
export class FormArticulosComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  @ViewChild(ImageCropperComponent)imageCropper: ImageCropperComponent;

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

  savedData:boolean;

  form:FormGroup;
  
  unidades:any[];
  changesDetected:boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  FotoCredencial:File  = null;
  
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

  subirFoto()
  {
    /*let data = {'trabajador_id': this.data.trabajador_id};
    this.saludService.upload(data, this.FotoCredencial, '').subscribe(
      response => {
        this.dialogRef.close(true);
        this.sharedService.showSnackBar("Ha subido correctamente el documento", null, 3000);
      }, errorResponse => {
        this.sharedService.showSnackBar(errorResponse.error.error, null, 3000);
      });*/
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }

  cortar()
  {
    this.imageCropped(this.imageCropper.crop());
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    console.log(this.imageChangedEvent);
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.FotoCredencial = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    );
  }

  base64ToFile(data, filename) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
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
}
