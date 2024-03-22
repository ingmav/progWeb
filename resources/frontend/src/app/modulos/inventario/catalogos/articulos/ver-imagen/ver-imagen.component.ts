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
}

@Component({
  selector: 'app-ver-imagen',
  standalone: true,
  imports: [ SharedModule],
  templateUrl: './ver-imagen.component.html',
  styleUrl: './ver-imagen.component.css'
})
export class VerImagenComponent {
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  dialogMaxSize:boolean;
  changesDetected:boolean = false;
  preview = '';
  constructor(
    public dialogRef: MatDialogRef<VerImagenComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
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
  
  ngOnInit(): void {
    this.cargarImagen();
    
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
            }
          }
          this.alertPanel.showError(response.error.message);
        }else{
          this.alertPanel.showError(response.error.message);
        }
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
    this.dialogRef.close();
  }
}
