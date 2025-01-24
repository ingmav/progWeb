import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosService } from '../catalogos.service';

export interface DialogData {
  api: string;
  accion: string;
  titulo: string;
  form:any
}

@Component({
  selector: 'app-form-catalogo-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form-catalogo-dialog.component.html',
  styleUrl: './form-catalogo-dialog.component.css'
})
export class FormCatalogoDialogComponent {
  form:FormGroup;
  isLoading:boolean = false;
  isSaving:boolean = false;
  dialogMaxSize:boolean;
  changesDetected:boolean;
  formulario:string = "";
  accion:string = "";

  constructor(
    public dialogRef: MatDialogRef<FormCatalogoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private catalogosService: CatalogosService
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
      'id':                         [''],
      'descripcion':                 ['',Validators.required],    
    });
    this.accion = this.inData.accion;
    this.formulario = this.inData.titulo;

    if(this.inData.form)
    {
      this.form.patchValue(this.inData.form);
    }
  }

  guardar()
  {
    this.isLoading = true;
      return this.catalogosService.Guardar(this.inData.api, this.form.value).subscribe({
        next:(response:any) => {
          this.cerrar();
        },
        error:(response:any) => {
          this.isLoading = false;
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
}
