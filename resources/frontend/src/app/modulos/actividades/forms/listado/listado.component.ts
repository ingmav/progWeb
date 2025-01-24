import { Component } from '@angular/core';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  styleUrl: './listado.component.css'
})
export class ListadoComponent {

  actividades:any =
  [
    { dia: 29, actividades:[]},
    { dia: 30, actividades:[]},
    { dia: 31, actividades:[]},
    { dia: 1, actividades:[
      {descripcion: "Actividades de entrega de medicamento para conocimiento", importancia: 1},
      // {descripcion: "Actividades de entrega de medicamento para conocimiento 2", importancia: 2},
      // {descripcion: "Actividades de entrega de medicamento para conocimiento 3", importancia: 2},
      // {descripcion: "Actividades de entrega de medicamento para conocimiento 4", importancia: 1},
      // {descripcion: "Actividades de entrega de medicamento para conocimiento 4", importancia: 1},
      
    ]},
    { dia: 2, actividades:[]},
    { dia: 3, actividades:[]},
    { dia: 5, actividades:[]},
    { dia: 6, actividades:[]},
    { dia: 7, actividades:[]},
    { dia: 8, actividades:[]},
    { dia: 9, actividades:[]},
    { dia: 10, actividades:[]},
    { dia: 12, actividades:[]},
    { dia: 13, actividades:[]},
    { dia: 14, actividades:[]},
    { dia: 15, actividades:[]},
    { dia: 16, actividades:[]},
    { dia: 17, actividades:[]},
    { dia: 19, actividades:[]},
    { dia: 20, actividades:[]},
    { dia: 21, actividades:[]},
    { dia: 22, actividades:[]},
    { dia: 23, actividades:[]},
    { dia: 24, actividades:[]},
    { dia: 26, actividades:[]},
    { dia: 27, actividades:[]},
    { dia: 28, actividades:[]},
    { dia: 29, actividades:[]},
    { dia: 30, actividades:[]},
    { dia: 1, actividades:[]},
  ];
}
