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
  selector: 'app-form-capacitacion-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form-capacitacion-dialog.component.html',
  styleUrl: './form-capacitacion-dialog.component.css'
})
export class FormCapacitacionDialogComponent {
  form:FormGroup;
  isLoading:boolean = false;
  isSaving:boolean = false;
  dialogMaxSize:boolean;
  changesDetected:boolean;
  formulario:string = "";
  accion:string = "";
  categorias:any = [
    {id:1, descripcion:"SEGURIDAD E HIGIENE"},
    {id:2, descripcion:"CAPACITACIÓN, ADIESTRAMIENTO Y PRODUCTIVIDAD LABORAL"},
    {id:3, descripcion:"PROTECCIÓN CIVIL"},
    {id:4, descripcion:"SIMULACROS"},
    {id:5, descripcion:"MEDIO AMBIENTE"},
  ]

  constructor(
    public dialogRef: MatDialogRef<FormCapacitacionDialogComponent>,
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
      'catalogo_tipo_categoria':                 ['',Validators.required],    
      'norma':                 ['',Validators.required],    
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
