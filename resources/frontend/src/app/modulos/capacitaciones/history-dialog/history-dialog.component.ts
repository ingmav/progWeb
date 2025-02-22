import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith, Subject, takeUntil } from 'rxjs';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogosService } from '../catalogos.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  filteredCatalogs:any = { };
  filterCatalogs:any = {};

  data:any = [];
  capacitaciones:any = [];
  pageSize:number = 50;
  displayedColumns: string[] = ['trabajador','estatus'];
  estatus: any[] = [{ id: 0, descripcion: 'TODOS'}, { id:1, descripcion: 'CAPACITADOS'}, { id:2, descripcion: 'NO CAPACITADOS'}];
  resultsLength = 0;
  isLoadingResults:boolean = false;
  searchQuery:string;
  form:FormGroup;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;
  
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
    private catalogosService:CatalogosService,
    private formBuilder: FormBuilder,
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
  ngOnInit(): void {
    this.dialogRef.addPanelClass('no-padding-dialog');
    this.searchQuery = '';

     this.form = this.formBuilder.group({
          'catalogo_capacitacion_id':   ['',Validators.required],
          'estatus':        [0],
          'buscador':       [''],
          
    });

    setTimeout(() => {
      
      this.catalogos();
    }, 10);
  }

  ngAfterViewInit(){
    
    this.paginator.page.subscribe(()=>{
      if(this.pageSize != this.paginator.pageSize){
        this.paginator.pageIndex = 0;
        this.pageSize = this.paginator.pageSize;
      }
      this.applySearch();
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

  applySearch(){
    this.isLoadingResults = true;
    let params:any = {
      page: this.paginator.pageIndex+1,
      per_page: this.paginator.pageSize,
      capacitacion_id: this.form.get('catalogo_capacitacion_id').value.id,
      search: this.form.get('buscador').value,
      estatus: this.form.get('estatus').value
    };

    return this.catalogosService.Buscar('his-personal-capacitacion', params.capacitacion_id,params).subscribe({
      next:(response:any) => {
        this.resultsLength = response.data.total;
        this.data = response.data.data;
        this.isLoadingResults = !this.isLoadingResults;
      },
      error:(response:any) => {
        this.isLoading = false; 
        this.isLoadingResults = !this.isLoadingResults;
        this.alertPanel.showError(response.error.message);
      }
});
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  catalogos(){
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

  cleanSearch(){
    this.searchQuery = '';
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(true);
  }
}
