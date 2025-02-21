import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-history-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './history-dialog.component.html',
  styleUrl: './history-dialog.component.css'
})
export class HistoryDialogComponent {
  dialogMaxSize:boolean;
  destroyed = new Subject<void>();
  currentScreenSize: string;
  changesDetected:boolean;
  isLoading:boolean = false;
  
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'xs'],
    [Breakpoints.Small, 'sm'],
    [Breakpoints.Medium, 'md'],
    [Breakpoints.Large, 'lg'],
    [Breakpoints.XLarge, 'xl'],
  ]);

  constructor(
    public dialogRef: MatDialogRef<HistoryDialogComponent>,
    private breakpointObserver: BreakpointObserver,
  ){
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
