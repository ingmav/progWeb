import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaPersonalComponent } from '../../inventario/catalogos/personal/lista-personal/lista-personal.component';

@Component({
  selector: 'app-trabajador',
  standalone: true,
  imports: [SharedModule, ListaPersonalComponent],
  templateUrl: './trabajador.component.html',
  styleUrl: './trabajador.component.css'
})
export class TrabajadorComponent {
  
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  dialogMaxSize:boolean;
  changesDetected:boolean;
  
  constructor(
    public dialogRef: MatDialogRef<TrabajadorComponent>,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  )
  {
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
    setTimeout(() => {
      
    }, 10);
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
