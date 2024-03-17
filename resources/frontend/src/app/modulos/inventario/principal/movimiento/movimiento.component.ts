import { Component, Inject, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {MatTable, MatTableModule} from '@angular/material/table';
import { ServicioService } from '../../servicio.service';
import { AlertPanelComponent } from 'src/app/shared/components/alert-panel/alert-panel.component';
import { map, startWith } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { DialogConfirmActionComponent } from 'src/app/shared/components/dialog-confirm-action/dialog-confirm-action.component';
import { FormArticulosComponent } from '../../catalogos/articulos/form-articulos/form-articulos.component';
import { FormPersonalComponent } from '../../catalogos/personal/form-personal/form-personal.component';

export interface DialogData {
  id: number;
}
export interface Articulos {
  id: number;
  articulo: string;
  persona_id: number;
  nombre_persona: string;
  cantidad: number;
}

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.css',
  providers: [DatePipe],
})
export class MovimientoComponent {

  @ViewChild(AlertPanelComponent) alertPanel: AlertPanelComponent;

  isLoading:boolean = false;
  isSaving:boolean = false;
  dialogMaxSize:boolean;
  form:FormGroup;
  changesDetected:boolean;
  savedData:boolean;
  filteredCatalogs:any = {};
  filterCatalogs:any = {};
  tipo_Movto:number = 0; 
  filtroFechaStart:String = '';
  articulo:any = { id:0, descripcion:''};
  personal:any = {id:0, descripcion:''};
  validacionIngresos:boolean = false;
  edicionForm:boolean = false;
  indexForm:number = 0;
  
  
  displayedColumns: string[] = ['articulo', 'persona', 'cantidad', 'acciones'];
  dataSource = [];

  @ViewChild(MatTable) table: MatTable<Articulos>;

  constructor(
    public dialogRef: MatDialogRef<MovimientoComponent>,
    @Inject(MAT_DIALOG_DATA) public inData: DialogData,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    public servicioService:ServicioService
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
      'proveedor':                  [''],
      'tipo_proveedor':             [''],
      'fecha':                      [''],
      'tipo_movto':                 ['',Validators.required],
      'articulo_ingresar':          [''],
      'trabajador_ingresar':        [''],
      'cantidad_ingresar':          [''],
      
    });

    this.cargarCatalogos();
    this.validaIngresos();
  }

  insertaArticulo()
  {
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '80%',
      height: '60%',
      disableClose: true,
      data:{}
    };

    const dialogRef = this.dialog.open(FormArticulosComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        return this.servicioService.obtenerCatalogos({}).subscribe({
          next:(response:any) => {
            this.filterCatalogs.articulo = response.articulo;
            this.form.patchValue({articulo_ingresar:result.data.id});
            console.log(this.form.value);
            console.log(result.id);
            console.log(response.articulo);
            },
          error:(response:any) => {
            this.alertPanel.showError(response.error.message);
          }
        });
      }
    });

  }
  insertaTrabajador()
  {
    let dialogConfig:any = {
      maxWidth: '100%',
      width: '80%',
      height: '25%',
      disableClose: true,
      data:{}
    };

    const dialogRef = this.dialog.open(FormPersonalComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        return this.servicioService.obtenerCatalogos({}).subscribe({
          next:(response:any) => {
            this.filterCatalogs.personal = response.personal;
            this.form.patchValue({trabajador_ingresar:result.data.id});
            },
          error:(response:any) => {
            this.alertPanel.showError(response.error.message);
          }
        });
      }
    });

  }

  cargarCatalogos()
  {
    return this.servicioService.obtenerCatalogos({}).subscribe({
      next:(response:any) => {
        this.filterCatalogs.articulo = response.articulo;
        this.filterCatalogs.personal = response.personal;
        //this.filteredCatalogs['articulo'] = this.form.controls['articulo_ingresar'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'articulo','descripcion')));
        //this.filteredCatalogs['personal'] = this.form.controls['trabajador_ingresar'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'personal','descripcion')));
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
      }
    });
    
  }

  tipoMovto(value)
  {
    this.tipo_Movto = value;
    let tamano = this.dataSource.length;
    for (let index = 0; index < tamano; index++) {
      this.dataSource.pop();
      
    }
    this.table.renderRows();
    this.table.renderRows();
  }

  guardar()
  {
    let datos =  this.form.value;
    datos.articulos = this.dataSource;
    datos.fecha_movimiento = this.filtroFechaStart;
    return this.servicioService.crearElemento(datos).subscribe({
      next:(response:any) => {
        this.dialogRef.close(true);
      },
      error:(response:any) => {
        this.alertPanel.showError(response.error.message);
        let objectDuplicado =  [];
        this.dataSource.forEach(element => {
          if(element.articulo_id == response.articulo_id)
          {
            element.error = 1; 
          }
          objectDuplicado.push(element);
        });
        this.dataSource = objectDuplicado;
        this.table.renderRows();
      }
    });
  }

  eliminar(id){
    const dialogRef = this.dialog.open(DialogConfirmActionComponent, {
      width: '500px',
      data: {title:'Eliminar Registro',message:'Esta seguro de eliminar este regisro?',hasOKBtn:true,btnColor:'warn',btnText:'Eliminar',btnIcon:'delete'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        let objectDuplicado =  [];
        let tamano =  this.dataSource.length;
        this.dataSource.forEach(element => {
          if(element.id != id)
          {
            objectDuplicado.push(element); 
          }
        });
        this.dataSource = objectDuplicado;
        this.table.renderRows();
        this.edicionForm = false;
        this.form.patchValue({articulo_ingresar:'', trabajador_ingresar:'',cantidad_ingresar:0});
        console.log(this.dataSource);
        if(tamano == 1 )
        {
          this.dataSource =  [];
        }
      }
    });
    
  }

  editar(obj, index){
    this.form.patchValue({
      'articulo_ingresar':          obj.id,
      'trabajador_ingresar':        obj.persona_id,
      'cantidad_ingresar':          obj.cantidad,
    });
    this.indexForm = index;
    this.edicionForm = obj.id;
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


  articuloSeleccionado(event: MatSelectChange)
  {
    this.articulo = {
      id: event.value,
      descripcion: event.source.triggerValue
    };
    this.validaIngresos();
  }
  
  personalSeleccionado(event: MatSelectChange)
  {
    this.personal = {
      id: event.value,
      descripcion: event.source.triggerValue
    };
    this.validaIngresos();
  }

  agregarArticulo() {
      let cantidad =  parseInt(this.form.get('cantidad_ingresar').value);

      let Articulos = { id: this.articulo.id, articulo: this.articulo.descripcion, cantidad: cantidad, persona_id:0, nombre_persona: '', error:0 };
      
      if(this.tipo_Movto == 1)
      {
        let proveedor = this.form.get('proveedor').value;
        Articulos.nombre_persona  = proveedor;  
        
      }else if(this.tipo_Movto == 2){
        Articulos.persona_id= this.personal.id;
        Articulos.nombre_persona  = this.personal.descripcion;
      }
      
      if(this.edicionForm)
      {
        let objectDuplicado = [];
        console.log(this.indexForm);
        console.log(this.dataSource);
        console.log(Articulos);
        for (let index = 0; index < this.dataSource.length; index++) {
          console.log(index);
          if(index == this.indexForm)
          {
            objectDuplicado.push(Articulos);
          }else{
            objectDuplicado.push(this.dataSource[index]);
          }
        }
        this.dataSource = objectDuplicado;
      }else{
        this.dataSource.push(Articulos);
      }
      this.table.renderRows();
      this.form.patchValue({articulo_ingresar:'', trabajador_ingresar:'',cantidad_ingresar:0}); 
      this.validacionIngresos = false;
      this.edicionForm = false;
      this.indexForm = 0;
  }

  validaIngresos()
  {
    let cantidad = parseInt(this.form.get('cantidad_ingresar').value);
    let nonmbre_proveedor = this.form.get('proveedor').value;
    
    if(this.articulo.id != 0)
    {
      if(this.personal.id != 0 && this.tipo_Movto == 2)
      {
          let cantidad = parseInt(this.form.get('cantidad_ingresar').value);
          if(cantidad>0)
          {
            this.validacionIngresos =true;
          }else
          {
            this.validacionIngresos = false;
          }
      }else if(this.tipo_Movto == 1)
      {
        if(nonmbre_proveedor !='')
        {
          if(cantidad>0)
          {
            this.validacionIngresos =true;
          }else
          {
            this.validacionIngresos = false;
          }
        }else
        {
          this.validacionIngresos = false;
        }
          

      }else
      {
        this.validacionIngresos = false;
      }
    }else
    {
      this.validacionIngresos = false;
    }
  }

  cambioFechaInicio(event:any){
    this.filtroFechaStart= this.datePipe.transform(event,'yyyy-MM-dd');
  }

  cancelarAccion(){
    this.cerrar();
  }

  cerrar(){
    this.dialogRef.close(this.savedData);
  }


}
